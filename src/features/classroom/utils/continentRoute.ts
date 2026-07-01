export const toContinentPathCode = (continentCode: string) =>
    continentCode.trim().toLowerCase();

export const toContinentApiCode = (continentCode: string) =>
    continentCode.trim().toUpperCase();

export const createClassroomCountryHref = (
        continentCode: string,
        countryId: string | number
    ) => `/classroom/${toContinentPathCode(continentCode)}/${countryId}`;

export const createLectureHref = (
        continentCode: string,
        countryId: string | number,
        courseId: string | number
    ) =>
    `${createClassroomCountryHref(continentCode, countryId)}/lecture/${courseId}`;