import { statusTheme } from '@/constants/colors';
import type { SafetyStatus } from '@/types';

export function getStatusCopy(status: SafetyStatus) {
  return statusTheme[status];
}
