import { useEffect, useState } from "react"
import { getChannelAPI } from "../../apis/article"

function useChannels() {
  const [channelList, setChannelList] = useState([])

  useEffect(() => {
    (async () => {
      const res = await getChannelAPI()
      const channelList = res.data
      setChannelList(channelList)
    })()
  }, [])

  return { channelList }
}

export {useChannels}
