import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@asgettickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
