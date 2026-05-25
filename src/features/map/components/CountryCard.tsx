interface Props {
  country: {
    name: string
    image: string
    lectures: number
  }
}

export default function CountryCard({
  country,
}: Props) {

  return (
    <div className="w-[150px] rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition">

      {/* 이미지 */}
      <img
        src={country.image}
        alt={country.name}
        className="w-full h-[100px] object-cover"
      />

      {/* 내용 */}
      <div className="p-3">

        <h3 className="font-semibold text-sm">
          {country.name}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          강의 {country.lectures}개
        </p>

      </div>
    </div>
  )
}