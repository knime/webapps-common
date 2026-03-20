# @knime/hub-features — analyticsEvents

## Preface

This package provides helpers related to analytics events. It provides 2 main behaviors:

- Provides a builder function that creates and normalizes event payloads
- Provides a sender function that forwards a given event payload to a third party API.
  The implementation of the third-party API is up to the consumer as long as it satisfies the adapter contract

The main reason why these behaviors are split are for increased flexibility and to also enable this feature being used on a setup where the creation of the event is separated to the sending of the event. Like for example, on host/guest application combination where there's an iframe communication layer between both apps.

## Usage examples

### Building event payloads

As stated above, some applications might only care (or have the correct setup) to construct events based on different code paths and user interactions.

```ts
import { analyticsEvents } from "@knime/hub-features/analytics";

// Create a small factory bound to your context
const { newEvent } = analyticsEvents.eventBuilder({ jobId: "job-123" });

// Build an event. Event ids are strongly-typed, combining their special format
// and validating payloads, if required
const event = newEvent({ id: "kai_prompted::kaiqa_button_prompt" });

// once you have this event object, the application can decide what to do with it.
// Whether that is sending it through an iframe as a message or some other event bus. OR sending it directly if it's so desired (see Sending events section)
```

### Keeping types in-sync

Due to the strict-type setup and the shape of the API of this package, reusing the type signature
of the function that creates the events can be tricky. However, this is helpful, for example, if you want to
wrap the create function with some other behavior of your own but keep the strong-type guarantees.
Below you can see an example for this use-case:

```ts
import {
  analyticsEvents,
  type CreateEventFn,
} from "@knime/hub-features/analytics";

const myCustomFunction: CreateEventFn = (...args) => {
  const { newEvent } = analyticsEvents.eventBuilder(TheNeededContext);

  // do something before

  const event = newEvent(...args);

  // do something with event
};
```

In this case, the type signature of `myCustomFunction` will match the one of `newEvent`, just like
in the previous example.

### Sending events

As stated in the preface, to send events, you need to provide an adapter

```ts
import {
  analyticsEvents,
  type AnalyticsAdapter,
} from "@knime/hub-features/analytics";

const myAdapter: AnalyticsAdapter = {
  sendEvent({ event, metadata, idParser }) {
    console.log("Parsed id", idParser(event.id));
    console.log("Metadata", metadata);
    console.log("Event", event)
  }
}

// create the sender
const sender = analyticsEvents.eventSender(myAdapter);

// some event
const { newEvent } = analyticsEvents.eventBuilder(TheNeededContext);
const event = newEvent(...);

// then...
sender.send(event);
```
