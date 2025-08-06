// Notification helpers for browser native notifications
// Keep simple and focused for reuse

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function ensureNotificationPermission(): Promise<boolean> {
  try {
    if (!isNotificationSupported()) return false
    if (Notification.permission === 'granted') return true
    if (Notification.permission === 'denied') return false
    const result = await Notification.requestPermission()
    return result === 'granted'
  } catch {
    return false
  }
}

export function showSystemNotification(
  title: string,
  body?: string,
  options?: NotificationOptions
): Notification | null {
  try {
    if (!isNotificationSupported()) return null
    if (Notification.permission !== 'granted') return null
    const notification = new Notification(title, {
      body,
      icon: options?.icon ?? '/favicon.ico',
      ...options,
    })
    return notification
  } catch {
    return null
  }
}
