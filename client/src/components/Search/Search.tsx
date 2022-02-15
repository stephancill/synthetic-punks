import { getAddress, isAddress } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import { useEnsResolveName } from "wagmi"

interface ISearchProps {
  onSearch: (address: string) => void
}

export const Search = ({onSearch}: ISearchProps) => {
  const [rawSearchQuery, setRawSearchQuery] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [{ data: resolvedSearchQuery}, resolveSearchQuery] = useEnsResolveName({name: searchQuery})

  useEffect(() => {
    const searchAddress = resolvedSearchQuery || searchQuery
    if (searchAddress && isAddress(searchAddress)) {
      const checksummed = getAddress(searchAddress)
      onSearch(checksummed)
    }
  }, [searchQuery, resolvedSearchQuery, onSearch])

  const handleSearch = () => {
    if (isAddress(rawSearchQuery) || rawSearchQuery.indexOf(".") > 0) {
      setSearchQuery(rawSearchQuery)
      resolveSearchQuery()
    }
  }

  return <span>
    <form onSubmit={(e) => {
      e.preventDefault()
      handleSearch()
    }}>
      <input type="text" placeholder="Search Address or ENS" value={rawSearchQuery} onChange={(e) => setRawSearchQuery(e.target.value)} />
      <button type="submit">Search</button>
    </form>
    
    
  </span>
}