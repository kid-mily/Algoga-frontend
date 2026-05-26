interface Props {
  countries: any[]

  selectedCountry: string

  onSelectCountry: (
    country: string
  ) => void
}

export default function CountryList({
  countries,
  selectedCountry,
  onSelectCountry,
}: Props) {

  return (
    <div className="p-4 border-t bg-white">

      <h2 className="text-sm font-bold mb-3">
        국가 선택
      </h2>

      <div className="flex flex-wrap gap-2">

        {countries.map(
          (country: any) => {

            const countryName =
              country.properties.name_ko ||
              country.properties.name

            const isSelected =
              selectedCountry ===
              countryName

            return (
              <button
                key={countryName}
                onClick={() =>
                  onSelectCountry(
                    countryName
                  )
                }
                className={`
                  px-3 py-2 rounded-lg text-sm border transition

                  ${
                    isSelected
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {countryName}
              </button>
            )
          }
        )}
      </div>
    </div>
  )
}