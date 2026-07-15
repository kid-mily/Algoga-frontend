"use client";

import { useEffect, useState } from "react";

import LoadingSpinner from "@/features/common/components/LoadingSpinner";
import { getFriends } from "../friend.service";
import type { Friend } from "../friend.types";
import BlockedList from "./BlockedList";
import FriendCode from "./FriendCode";
import FriendCodeSearch from "./FriendCodeSearch";
import FriendList from "./FriendList";
import FriendRequestList from "./FriendRequestList";
import FriendTabs from "./FriendTabs";

type ManagementTab = "list" | "requests" | "blocked";

interface FriendManagementProps {
  personalCode: string;
}

export default function FriendManagement({
  personalCode,
}: FriendManagementProps) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] =
    useState<ManagementTab>("list");

  useEffect(() => {
    const controller = new AbortController();

    const loadFriends = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const result = await getFriends(
          controller.signal
        );

        setFriends(result);
      } catch (error) {
        if (controller.signal.aborted) return;

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "친구 목록을 불러오지 못했습니다."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadFriends();

    return () => {
      controller.abort();
    };
  }, []);

  const handleRemoveFriend = (
    relationId: number
  ) => {
    setFriends((previous) =>
      previous.filter(
        (friend) =>
          friend.relationId !== relationId
      )
    );
  };

  return (
    <div className="space-y-4">
      <section className="grid gap-4 lg:grid-cols-2">
        <FriendCode personalCode={personalCode} />

        <FriendCodeSearch
          friendCount={friends.length}
        />
      </section>

      <article className="overflow-hidden rounded-2xl border border-[#E5EDF5] bg-white shadow-sm">
        <div className="border-b border-[#E5EDF5] px-5 pt-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold tracking-[0.14em] text-[#439A97]">
                FRIENDS
              </p>

              <h2 className="mt-1 text-sm font-bold text-[#0A1628]">
                친구 목록
              </h2>
            </div>

            <p className="text-xs text-[#8A9BB0]">
              현재 친구{" "}
              <span className="font-bold text-[#439A97]">
                {friends.length}
              </span>
              명
            </p>
          </div>

          <FriendTabs
            variant="underline"
            activeValue={activeTab}
            onChange={setActiveTab}
            items={[
              {
                value: "list",
                label: "친구 목록",
                count: friends.length,
              },
              {
                value: "requests",
                label: "받은 요청",
                count: 0,
              },
              {
                value: "blocked",
                label: "차단 목록",
                count: 0,
              },
            ]}
          />
        </div>

        {isLoading ? (
          <div className="py-10">
            <LoadingSpinner text="친구 목록을 불러오는 중입니다..." />
          </div>
        ) : errorMessage ? (
          <p className="px-5 py-8 text-center text-sm text-red-500">
            {errorMessage}
          </p>
        ) : (
          <>
            {activeTab === "list" && (
              <FriendList
                friends={friends}
                onRemoveFriend={
                  handleRemoveFriend
                }
              />
            )}

            {activeTab === "requests" && (
              <FriendRequestList />
            )}

            {activeTab === "blocked" && (
              <BlockedList />
            )}
          </>
        )}
      </article>
    </div>
  );
}