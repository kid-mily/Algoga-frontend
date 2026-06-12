export interface Accommodation {
  accommodationId: number;
  countryId: number;
  name: string;
  address: string;
  description: string;
  pricePerNight: number;
  imageUrl?: string;
}

export interface AccommodationPayload {
  countryId: number;
  name: string;
  address: string;
  description: string;
  pricePerNight: number;
  image?: File | null;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults?: number;
}

export interface Flight {
  flightId: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

export type RawPackageRecord = Record<string, unknown>;

const getRecord = (item: unknown): RawPackageRecord => {
  return typeof item === "object" && item !== null
    ? (item as RawPackageRecord)
    : {};
};

const getNestedRecord = (
  record: RawPackageRecord,
  keys: string[]
): RawPackageRecord => {
  const nested = keys.map((key) => record[key]).find((item) => item !== undefined);

  return getRecord(nested);
};

const getNumber = (
  record: RawPackageRecord,
  keys: string[],
  fallback = 0
) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  return typeof value === "number" ? value : Number(value || fallback);
};

const getNestedNumber = (
  record: RawPackageRecord,
  keys: string[],
  nestedKeys: string[],
  fallback = 0
) => {
  const directValue = getNumber(record, keys, NaN);

  if (!Number.isNaN(directValue)) {
    return directValue;
  }

  const nestedRecord = getNestedRecord(record, nestedKeys);

  return getNumber(nestedRecord, keys, fallback);
};

const getString = (
  record: RawPackageRecord,
  keys: string[],
  fallback = ""
) => {
  const value = keys.map((key) => record[key]).find((item) => item !== undefined);

  return typeof value === "string" ? value : fallback;
};

export const normalizeAccommodation = (
  item: unknown,
  fallbackId: number
): Accommodation => {
  const responseRecord = getRecord(item);
  const nestedRecord = getNestedRecord(responseRecord, [
    "accommodation",
    "hotel",
    "item",
    "content",
  ]);
  const record =
    Object.keys(nestedRecord).length > 0 ? nestedRecord : responseRecord;

  return {
    accommodationId: getNumber(
      record,
      ["accommodationId", "accommodation_id", "hotelId", "id"],
      fallbackId
    ),
    countryId: getNestedNumber(
      record,
      ["countryId", "country_id", "id"],
      ["country"]
    ),
    name: getString(record, [
      "name",
      "hotelName",
      "accommodationName",
      "title",
    ]),
    address: getString(record, [
      "address",
      "location",
      "roadAddress",
      "fullAddress",
    ]),
    description: getString(record, ["description", "content", "summary"]),
    pricePerNight: getNumber(record, [
      "pricePerNight",
      "price",
      "nightlyPrice",
      "oneNightPrice",
      "cost",
    ]),
    imageUrl: getString(record, [
      "imageUrl",
      "thumbnailUrl",
      "image",
      "imagePath",
      "accommodationImageUrl",
    ]),
  };
};

export const normalizeFlight = (item: unknown, fallbackId: number): Flight => {
  const record =
    typeof item === "object" && item !== null ? (item as RawPackageRecord) : {};

  return {
    flightId: getString(record, ["flightId", "id"], String(fallbackId)),
    airline: getString(record, ["airline", "airlineName", "carrier"], "항공사"),
    flightNumber: getString(record, ["flightNumber", "number"], "-"),
    origin: getString(record, ["origin", "departureAirport", "from"], "-"),
    destination: getString(record, ["destination", "arrivalAirport", "to"], "-"),
    departureTime: getString(record, ["departureTime", "departureAt"], "-"),
    arrivalTime: getString(record, ["arrivalTime", "arrivalAt"], "-"),
    price: getNumber(record, ["price", "amount", "fare"]),
  };
};
