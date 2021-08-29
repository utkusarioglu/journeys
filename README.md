# Journeys

A tool for creating representations of your code's data throughout its journey
through systems and components.

## Warning

This project is not ready for production use. It's merely an experiment at this
point. Check your types before building upon what this library tells you.

Also, note that the api will surely change a lot as the code matures.

## Usage

Currently, the main tool for building your data journey is through the `Layover`
generic type.

```ts
import type { Layover } from 'journeys';

interface SessionCheckApiShape {
  sessionId: string;
  fingerprint: string;
}

/**
 * The name of the interface implies that this is the journey for the
 * session data in an upstream direction, meaning, towards the
 * persistence layer.
 */
export interface SessionJourneyUp {
  _router: Layover<
    SessionCheckApiShape,
    {
      requestTime: number; // epoch
    }
  >;

  _model: Layover<SessionJourneyUp['_router']['Out'], {}, 'fingerprint'>;

  _db: Layover<
    SessionJourneyUp['_model']['Out'],
    {
      id: string; // uuid
    },
    never,
    {
      sessionId: 'session_id';
    }
  >;
}
```

In this example, we have an api shape that is defined by `SessionCheckApiShape`.
The source of this type may be some kind of OpenApi generator or just some
handcrafted api type that becomes the basis for the first _layover_ of the data
at the router component, where it is greeted by the system.

### Layover generic type

Currently this type is pretty much the entirety of this repo's unique code. And
it's current state, it doesn't give much of an indication as to what each params
mean. We will clarify this here make the context clear:

```ts
Layover<
  Types_that_come_into_the_component,
  Types_that_are_generated_and_added_into_the_data,
  Types_that_are_removed_from_the_data,
  Name_changes_to_the_data
>;
```

#### Types_that_are_generated_and_added_into_the_data

These can be data that are brought in by some other source or something auto
generated such as timestamps. In the example above, `_router` layover includes
`requestTime` in the data object, while `_db` includes `id`.

#### Types_that_are_removed_from_the_data

These are properties of the data that are not needed or shall not be included in
the following layovers. In the example above, the `_model` layover removes the
`fingerprint` property from the data object.

#### Name_changes_to_the_data

The values included in this object rename the property keys of the data. In the
example above the `_db` renames the `sessionId` component as `session_id`.

### General use of Journeys

Journeys is built around the idea that a data type by itself tells only a
portion of the story. Unless the team uses the utility types shipped with
typescript effectively, it's very possible to transmit misrepresented data
between components. This repo aims to make sure that he data shape is precise
between all components. And the journey of the data is set in a single object
from where it can be consumed by all the components on the data's pipeline.
