import { Tabs } from "@arco-design/web-react";
import {
  IconCommand,
  IconFile,
  IconFolder,
  IconSkin,
  IconStorage,
} from "@arco-design/web-react/icon";
import React, { useEffect, useState } from "react";

import { getFeeds, getGroups } from "../../apis";
import darkThemePreview from "../../assets/dark.png";
import lightThemePreview from "../../assets/light.png";
import systemThemePreview from "../../assets/system.png";
import Appearance from "./Appearance";
import FeedList from "./FeedList";
import General from "./General.jsx";
import GroupList from "./GroupList";
import Hotkeys from "./Hotkeys";
import "./SettingsTabs.css";

const SettingsTabs = () => {
  const [feeds, setFeeds] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showFeeds, setShowFeeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    setLoading(true);
    const feedResponse = await getFeeds();
    const groupResponse = await getGroups();

    if (feedResponse && groupResponse) {
      const feeds = feedResponse.data;
      const groupsWithFeedCount = groupResponse.data.map((group) => ({
        ...group,
        feedCount: feeds.filter((feed) => feed.category.id === group.id).length,
      }));

      const sortedFeeds = feeds.sort((a, b) =>
        a.title.localeCompare(b.title, "en"),
      );
      setFeeds(sortedFeeds);
      setGroups(
        groupsWithFeedCount.sort((a, b) =>
          a.title.localeCompare(b.title, "en"),
        ),
      );
      setShowFeeds(sortedFeeds);
      setLoading(false);
    }
  };

  const preloadImages = () => {
    const images = [darkThemePreview, lightThemePreview, systemThemePreview];
    for (const image of images) {
      const img = new Image();
      img.src = image;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    refreshData();
    preloadImages();
  }, []);

  return (
    <Tabs defaultActiveTab="1" tabPosition="top">
      <Tabs.TabPane
        key="1"
        title={
          <span>
            <IconFile style={{ marginRight: 6 }} />
            Feeds
          </span>
        }
      >
        <FeedList
          feeds={feeds}
          groups={groups}
          loading={loading}
          setFeeds={setFeeds}
          setShowFeeds={setShowFeeds}
          showFeeds={showFeeds}
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="2"
        title={
          <span>
            <IconFolder style={{ marginRight: 6 }} />
            Groups
          </span>
        }
      >
        <GroupList
          groups={groups}
          loading={loading}
          setGroups={setGroups}
          setShowFeeds={setShowFeeds}
          showFeeds={showFeeds}
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="3"
        title={
          <span>
            <IconStorage style={{ marginRight: 6 }} />
            General
          </span>
        }
      >
        <General />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="4"
        title={
          <span>
            <IconSkin style={{ marginRight: 6 }} />
            Appearance
          </span>
        }
      >
        <Appearance />
      </Tabs.TabPane>
      <Tabs.TabPane
        key="5"
        title={
          <span>
            <IconCommand style={{ marginRight: 6 }} />
            Hotkeys
          </span>
        }
      >
        <Hotkeys />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default SettingsTabs;
