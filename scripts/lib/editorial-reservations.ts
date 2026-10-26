import { instant, object, text } from './curious-ai.ts';

export interface ReservationEvent {
  action: 'reserve' | 'release';
  candidate_key: string;
  owner: string;
  at: string;
  reason: string;
}
export interface ReservationSnapshot {
  head: string | null;
  events: ReservationEvent[];
}
export interface ReservationStore {
  read(): Promise<ReservationSnapshot>;
  // The adapter must atomically reject a stale parent; it must never force.
  compareAndSwap(expectedHead: string | null, events: ReservationEvent[]): Promise<boolean>;
}
export function activeReservations(events: ReservationEvent[]) {
  const active = new Map<string, ReservationEvent>();
  for (const raw of events) {
    if (
      !object(raw) ||
      !['reserve', 'release'].includes(raw.action) ||
      !text(raw.candidate_key) ||
      !text(raw.owner) ||
      !instant(raw.at) ||
      !text(raw.reason)
    )
      throw new Error('Malformed reservation event');
    const prior = active.get(raw.candidate_key);
    if (raw.action === 'reserve') {
      if (prior) throw new Error('Conflicting or repeated reserve without release');
      active.set(raw.candidate_key, raw);
    } else {
      if (!prior || prior.owner !== raw.owner)
        throw new Error('Only owner can release reservation');
      active.delete(raw.candidate_key);
    }
  }
  return active;
}
// Host adapter uses a child commit and a non-forced Git ref update. A local
// checked snapshot is not a reservation until that update succeeds and is read back.
export async function reserveCoverage(
  store: ReservationStore,
  candidateKey: string,
  owner: string,
  at: string,
) {
  if (!text(candidateKey) || !text(owner) || !instant(at))
    throw new Error('Reservation requires stable key, owner and ISO timestamp');
  for (let attempt = 0; attempt < 3; attempt++) {
    const snapshot = await store.read();
    const prior = activeReservations(snapshot.events).get(candidateKey);
    if (prior) {
      if (prior.owner !== owner) throw new Error(`Coverage reserved by ${prior.owner}`);
      return { reused: true, head: snapshot.head };
    }
    const event: ReservationEvent = {
      action: 'reserve',
      candidate_key: candidateKey,
      owner,
      at,
      reason: 'Reserve verified event before drafting',
    };
    if (await store.compareAndSwap(snapshot.head, [...snapshot.events, event])) {
      const observed = await store.read();
      if (activeReservations(observed.events).get(candidateKey)?.owner !== owner)
        throw new Error('Reservation readback did not confirm owner');
      return { reused: false, head: observed.head };
    }
  }
  throw new Error('Reservation head kept moving; refresh before retry');
}
