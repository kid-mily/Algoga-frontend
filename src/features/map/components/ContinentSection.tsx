import CountryCard from './CountryCard'

interface Props {
  continentName: string
  countries: any[]
}

export default function ContinentSection({
  continentName,
  countries,
}: Props) {

  return (
    <section className="mt-6 bg-white rounded-2xl border overflow-hidden">

      {/* 상단 제목 */}
      <div className="flex items-center gap-2 px-6 py-4 border-b">

        <div className="w-2 h-2 rounded-full bg-teal-400" />

        <h2 className="font-bold text-gray-800">
          {continentName} 여행지
        </h2>

        <span className="text-sm text-gray-400">
          ({countries.length}개국)
        </span>
      </div>

      {/* 카드 영역 */}
      <div className="flex gap-4 overflow-x-auto p-6">

        {countries.map(
          (country) => (
            <CountryCard
              key={country.name}
              country={country}
            />
          )
        )}

      </div>
    </section>
  )
}