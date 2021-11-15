import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react"
import { useUID } from "react-uid"

const Context = React.createContext<NodeManagerContext>({
  nodes: {},
  register: () => {},
  unregister: () => {},
  namespace: "",
})

type HTMLElementMap = { [key: string]: HTMLElement }

export interface NodeManagerContext {
  nodes: HTMLElementMap
  register: (key: string, node: HTMLElement) => void
  unregister: (key: string) => void
  namespace: string
}

export interface NodeManagerProps {
  children: React.ReactNode
}

export const NodeManager: React.FC<NodeManagerProps> = ({ children }) => {
  const [nodes, setNodes] = useState<HTMLElementMap>({})
  const namespace = useUID()

  const register = useCallback<NodeManagerContext["register"]>((key, node) => {
    setNodes((n) => ({ ...n, [key]: node }))
  }, [])

  const unregister = useCallback<NodeManagerContext["unregister"]>((key) => {
    setNodes((n) => {
      const { [key]: omitted, ...rest } = n

      return rest
    })
  }, [])

  const context = useMemo(() => {
    return {
      namespace,
      nodes,
      register,
      unregister,
    }
  }, [nodes, register, unregister, namespace])

  return <Context.Provider value={context}>{children}</Context.Provider>
}

// sort an array of DOM nodes according to the HTML tree order
// http://www.w3.org/TR/html5/infrastructure.html#tree-order
function sortNodes(nodes: HTMLElement[]) {
  return nodes.sort(function (a: HTMLElement, b: HTMLElement) {
    var posCompare = a.compareDocumentPosition(b)

    if (posCompare & 4 || posCompare & 16) {
      // a < b
      return -1
    } else if (posCompare & 2 || posCompare & 8) {
      // a > b
      return 1
    } else if (posCompare & 1 || posCompare & 32) {
      throw new Error("Cannot sort the given nodes.")
    } else {
      return 0
    }
  })
}

// returns nodes in DOM order
export function useOrderedNodes(sorter = sortNodes) {
  const [matches, setMatches] = useState<HTMLElement[]>([])
  const { nodes, namespace } = useContext(Context)

  useLayoutEffect(() => {
    const sorted = sorter(Object.keys(nodes).map((k) => nodes[k]))
    setMatches(sorted)
  }, [nodes, namespace, sorter])

  return matches
}

// returns a map of node IDs to nodes
export function useNodes() {
  const { nodes } = useContext(Context)
  return nodes
}

export function useRegisteredRef(key: string) {
  const { register, unregister } = useContext(Context)

  const callback = useCallback(
    (node) => {
      if (node) {
        register(key, node)
      } else {
        unregister(key)
      }
    },
    [key, register, unregister]
  )

  return callback
}
