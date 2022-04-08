import { ReactNode, VFC, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export function useDialogPortal(parent?: HTMLElement) {
  const portalContainer = useRef(document.createElement('div')).current
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // SSR を考慮し、useEffect 内で初期値 document.body を指定
    const actualParent = parent || document.body
    actualParent.appendChild(portalContainer)
    setIsReady(true)
    return () => {
      setIsReady(false)
      actualParent.removeChild(portalContainer)
    }
  }, [portalContainer, parent])

  const Portal: VFC<{ children: ReactNode }> = useCallback(
    ({ children }) => {
      if (!isReady) {
        // コンテナの append が完了するまでは子のライフサイクルを開始させない
        return null
      }
      return createPortal(children, portalContainer)
    },
    [isReady, portalContainer],
  )

  return {
    Portal,
    isReady,
  }
}