import type { BookingDto } from '~/types/api'
import { getReceiptFilename } from '~/utils/bookingReceipt'

export function useBookingReceipt() {
  const downloading = ref(false)

  const download = async (element: HTMLElement | null, booking: BookingDto) => {
    if (!element || downloading.value) return

    downloading.value = true
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#fafaf8',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 12
      const maxWidth = pageWidth - margin * 2
      const maxHeight = pageHeight - margin * 2

      let renderWidth = maxWidth
      let renderHeight = (canvas.height * renderWidth) / canvas.width

      if (renderHeight > maxHeight) {
        renderHeight = maxHeight
        renderWidth = (canvas.width * renderHeight) / canvas.height
      }

      const offsetX = (pageWidth - renderWidth) / 2
      pdf.addImage(imgData, 'PNG', offsetX, margin, renderWidth, renderHeight)
      pdf.save(getReceiptFilename(booking.bookingReference))
    } finally {
      downloading.value = false
    }
  }

  return { downloading, download }
}
