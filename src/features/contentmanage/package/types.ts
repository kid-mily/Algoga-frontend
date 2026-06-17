export interface CourseCountry {
  countryId: number;
  countryName: string;
  countryCode?: string;
  continentCode?: string;
  continentName?: string;
}

export interface Accommodation {
  accommodationId: number;
  countryId: number;
  name: string;
  address: string;
  description: string;
  pricePerNight: number;
  nights: number;
  imageUrl?: string;
}

export interface AccommodationPayload {
  countryId: number;
  name: string;
  address: string;
  description: string;
  pricePerNight: number;
  nights: number;
  image?: File | null;
}

export interface FlightSearchParams {
  destination: string;
  departureDate: string;
}

export interface Flight {
  flightId: string;
  airline: string;
  flightNumber: string;
  departure: string;
  arrival: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
}

export interface TravelPackage {
  packageId: number;
  countryId: number;
  countryName: string;
  accommodationId: number;
  accommodationName: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  checkInDate: string;
  checkOutDate: string;
  flightNumber: string;
  airline: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  flightPrice: number;
}

export interface PackagePayload {
  countryId: number;
  accommodationId: number;
  name: string;
  description: string;
  price: number;
  checkInDate: string;
  checkOutDate: string;
  flightInfo: {
    flightNumber: string;
    airline: string;
    departure: string;
    arrival: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
  };
  flightPrice: number;
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
      ["countryId", "country_id"],
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
    nights: getNumber(record, ["nights", "nightCount", "stayNights"], 1),
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
    departure: getString(record, ["departure", "origin", "departureAirport", "from"], "-"),
    arrival: getString(record, ["arrival", "destination", "arrivalAirport", "to"], "-"),
    origin: getString(record, ["departure", "origin", "departureAirport", "from"], "-"),
    destination: getString(record, ["arrival", "destination", "arrivalAirport", "to"], "-"),
    departureTime: getString(record, ["departureTime", "departureAt"], "-"),
    arrivalTime: getString(record, ["arrivalTime", "arrivalAt"], "-"),
    duration: getString(record, ["duration"], "-"),
    price: getNumber(record, ["price", "amount", "fare"]),
  };
};

export const normalizeTravelPackage = (
  item: unknown,
  fallbackId: number
): TravelPackage => {
  const responseRecord = getRecord(item);
  const nestedRecord = getNestedRecord(responseRecord, [
    "package",
    "travelPackage",
    "item",
    "content",
  ]);
  const record =
    Object.keys(nestedRecord).length > 0 ? nestedRecord : responseRecord;
  const accommodation = getNestedRecord(record, ["accommodation", "hotel"]);
  const country = getNestedRecord(record, ["country"]);
  const flightInfo = getNestedRecord(record, ["flightInfo", "flight"]);
  const packageId = getNumber(
    record,
    ["packageId", "travelPackageId", "id"],
    fallbackId
  );
  const price = getNumber(record, ["price", "packagePrice", "amount"]);
  const flightPrice = getNumber(record, ["flightPrice", "flightAmount"]) ||
    getNumber(flightInfo, ["price"]);

  return {
    packageId,
    countryId: getNestedNumber(record, ["countryId", "country_id"], ["country"]),
    countryName:
      getString(record, ["countryName"]) ||
      getString(country, ["countryName", "name"], "-"),
    accommodationId: getNestedNumber(
      record,
      ["accommodationId", "hotelId"],
      ["accommodation", "hotel"]
    ),
    accommodationName:
      getString(record, ["accommodationName", "hotelName"]) ||
      getString(accommodation, ["name", "accommodationName", "hotelName"], "-"),
    name: getString(record, ["name", "title", "packageName"], `패키지 #${packageId}`),
    description: getString(record, ["description", "content", "summary"]),
    imageUrl: getString(record, ["imageUrl", "image", "thumbnailUrl"]),
    price,
    checkInDate: getString(record, ["checkInDate", "startDate"]),
    checkOutDate: getString(record, ["checkOutDate", "endDate"]),
    flightNumber: getString(flightInfo, ["flightNumber"], "-"),
    airline: getString(flightInfo, ["airline"], "-"),
    departure: getString(flightInfo, ["departure", "origin", "from"], "-"),
    arrival: getString(flightInfo, ["arrival", "destination", "to"], "-"),
    departureTime: getString(flightInfo, ["departureTime", "departureAt"], "-"),
    arrivalTime: getString(flightInfo, ["arrivalTime", "arrivalAt"], "-"),
    duration: getString(flightInfo, ["duration"], "-"),
    flightPrice,
  };
};
