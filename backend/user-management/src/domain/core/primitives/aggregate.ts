import { AggregateRoot } from "@nestjs/cqrs";

export class Aggregate extends AggregateRoot{
  domainEvents: any[] = [];
  
  addDomainEvent(event: any) {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): any[] {
    const events = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}