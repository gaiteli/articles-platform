import { useEffect, useState } from "react"
import { getChannelsAdminAPI } from "../../apis/articles_platform/channel"

function useChannels() {
  const [channelList, setChannelList] = useState([])

  useEffect(() => {
    (async () => {
      const res = await getChannelsAdminAPI()
      const channelList = res.data.channels
      setChannelList(channelList)
    })()
  }, [])

  return { channelList }
}

export {useChannels}
