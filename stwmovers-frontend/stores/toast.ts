export type ToastKind = 'info' | 'success' | 'error'

export type Toast = { id: number; message: string; kind: ToastKind }

export const useToastStore = defineStore('toast', {
  state: () => ({ items: [] as Toast[] }),
  actions: {
    show(message: string, kind: ToastKind = 'info') {
      const id = Date.now()
      this.items.push({ id, message, kind })
      setTimeout(() => this.dismiss(id), 4000)
    },
    dismiss(id: number) {
      this.items = this.items.filter((t) => t.id !== id)
    },
  },
})
