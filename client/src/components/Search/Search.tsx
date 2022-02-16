import { getAddress, isAddress } from "ethers/lib/utils"
import { useEffect, useState } from "react"
import { useEnsResolveName } from "wagmi"
import searchSmall from "../../img/search.svg"
import style from "./Search.module.css"

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

  return <span className={style.searchContainer}>
    <form id="search-form" onSubmit={(e) => {
      e.preventDefault()
      handleSearch()
    }}>
    </form>
    <input type="text" placeholder="Search Address or ENS" value={rawSearchQuery} onChange={(e) => setRawSearchQuery(e.target.value)} />
    <button form="search-form" type="submit"><img src={searchSmall}/></button>
    
  </span>
}