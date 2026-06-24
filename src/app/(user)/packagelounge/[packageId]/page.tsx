import { notFound, redirect } from "next/navigation";

interface PackageDetailPageProps {
    params: Promise<{
        packageId: string;
    }>;

    searchParams: Promise<{
        courseId?: string;
        countryId?: string;
    }>;
}

export default async function PackageDetailPage({ params, searchParams }: PackageDetailPageProps) {
    const { packageId } = await params;
    const query = await searchParams;

    if (!query.courseId || !query.countryId) {
        notFound();
    }

    const reservationUrl = `/packagelounge/reservation?package=${packageId}&courseId=${query.courseId}&countryId=${query.countryId}`;
    redirect(reservationUrl);
}