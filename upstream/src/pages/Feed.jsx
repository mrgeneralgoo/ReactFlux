import { useParams } from "react-router-dom";

import { useAtomValue } from "jotai";
import { apiClient } from "../apis/axios";
import { buildEntriesUrl } from "../apis/index";
import { configAtom } from "../atoms/configAtom";
import Content from "../components/Content/Content";
import { ContentProvider } from "../components/Content/ContentContext";

const Feed = () => {
  const { id: feedId } = useParams();
  const config = useAtomValue(configAtom);
  const { orderBy, pageSize } = config;

  const getFeedEntries = async (offset = 0, status = null) => {
    const baseParams = {
      baseUrl: `/v1/feeds/${feedId}/entries`,
      orderField: orderBy,
      offset,
      limit: pageSize,
      status,
    };

    const url = buildEntriesUrl(baseParams);
    return apiClient.get(url);
  };

  const markFeedAsRead = async () => {
    return apiClient.put(`/v1/feeds/${feedId}/mark-all-as-read`);
  };

  return (
    <ContentProvider>
      <Content
        info={{ from: "feed", id: feedId }}
        getEntries={getFeedEntries}
        markAllAsRead={markFeedAsRead}
      />
    </ContentProvider>
  );
};

export default Feed;
