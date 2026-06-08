// 첨부자료

'use client'

interface LectureAttachmentsProps {
    fileUrls: string[];     
}

export default function LectureAttachments({ fileUrls }: LectureAttachmentsProps) {
    // 첨부파일이 없으면 아예 렌더링하지 않음
    if (!fileUrls || fileUrls.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <h2 className="text-lg font-bold text-[#0A1628] flex items-center gap-2">
                    <img src="/images/download.svg" alt="다운" />
                        첨부 자료
                </h2>
            </div>
            
            <div> 
                {fileUrls.map((url, index) => {
                // URL에서 파일명만 추출
                const fileName = url.substring(url.lastIndexOf('/') + 1) || `첨부파일 ${index + 1}`;
                
                return (
                    <div key={index} className="flex justify-between items-center bg-[#F5F7FA] p-4 rounded-xl border border-gray-100 mb-3">
                    <span className="text-sm font-medium text-[#0A1628]">{fileName}</span>
                    <a 
                        href={url} 
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#439A97] font-semibold hover:underline"
                    >
                        다운 받기
                    </a>
                    </div>
                );
                })}
            </div>
        </div>
    );
}