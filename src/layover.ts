import type { MapKeys } from './map-keys';
import type { RecordAny } from './helpers';

/**
 * Handles the data transformations for a single data node
 */
type LayoverWithTranslation<
  In extends RecordAny,
  Auto extends RecordAny = {},
  SplitLiterals extends keyof (In & Auto) = never,
  Translations extends Record<keyof Translations, keyof any> = {}
> = {
  /** In values */
  InUntranslated: In;
  /** In values translated using translations */
  In: MapKeys<In, Translations>;
  /** Properties added during the node */
  JoinsUntranslated: Auto;
  /** Properties added during the node with translated keys */
  Joins: MapKeys<Auto, Translations>;
  /** Split literals that are given as input */
  SplitLiterals: SplitLiterals;
  /** Split properties */
  SplitsUntranslated: Pick<In & Auto, SplitLiterals>;
  /** Split properties with translated keys */
  Splits: MapKeys<Pick<In & Auto, SplitLiterals>, Translations>;
  /** translation properties given as params */
  Translations: Translations;
  /** out values without translations */
  OutUntranslated: Omit<In & Auto, SplitLiterals>;
  /** out values with translation */
  Out: MapKeys<Omit<In & Auto, SplitLiterals>, Translations>;
};

/**
 * Handles the data transformations for a single data node
 */
type LayoverWithoutTranslation<
  In extends RecordAny,
  Auto extends RecordAny = {},
  SplitLiterals extends keyof (In & Auto) = never
> = {
  /** In values */
  InUntranslated: In;
  /** In values translated using translations */
  In: In;
  /** Properties added during the node */
  JoinsUntranslated: Auto;
  /** Properties added during the node with translated keys */
  Joins: Auto;
  /** Split literals that are given as input */
  SplitLiterals: SplitLiterals;
  /** Split properties */
  SplitsUntranslated: Pick<In & Auto, SplitLiterals>;
  /** Split properties with translated keys */
  Splits: Pick<In & Auto, SplitLiterals>;
  /** out values without translations */
  OutUntranslated: Omit<In & Auto, SplitLiterals>;
  /** out values with translation */
  Out: Omit<In & Auto, SplitLiterals>;
};

export type Layover<
  /** Properties that go into a node */
  In extends RecordAny,
  /** Properties added to the object before it's sent to the next node */
  Auto extends RecordAny = {},
  /** Properties removed from the data object before it's sent to the next node */
  SplitLiterals extends keyof (In & Auto) = never,
  /** Translations made to the property names */
  Translations extends Record<keyof Translations, keyof any> | void = void
> = Translations extends Record<keyof any, keyof any>
  ? LayoverWithTranslation<In, Auto, SplitLiterals, Translations>
  : LayoverWithoutTranslation<In, Auto, SplitLiterals>;
