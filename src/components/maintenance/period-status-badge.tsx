import { DateTime } from 'luxon';
import { match } from 'ts-pattern';
import type { DenyPeriod, PeriodStatus } from '~/data/types';
import { Badge } from '~/ui';

/**
 * Derives the current status of a deny period relative to now.
 * Returns `'active'`, `'upcoming'`, or `'past'`.
 */
export const getPeriodStatus = (period: DenyPeriod): PeriodStatus => {
  const now = DateTime.now().toSeconds();
  if (period.endTime < now) return 'past';
  if (period.startTime > now) return 'upcoming';
  return 'active';
};

interface Props {
  /** Status to display */
  status: PeriodStatus;
}

/** Coloured badge reflecting whether a deny period is active, upcoming, or past. */
export const PeriodStatusBadge = (props: Props) => {
  const { status } = props;
  return match(status)
    .with('active', () => (
      <Badge size="sm" variant="subtle" colorPalette="red">
        Active
      </Badge>
    ))
    .with('upcoming', () => (
      <Badge size="sm" variant="subtle" colorPalette="yellow">
        Upcoming
      </Badge>
    ))
    .with('past', () => (
      <Badge size="sm" variant="subtle" colorPalette="gray">
        Past
      </Badge>
    ))
    .exhaustive();
};
