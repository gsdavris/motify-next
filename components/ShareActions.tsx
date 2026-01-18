"use client";

import React from "react";
import {
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Check,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";

type ShareActionsProps = {
  shareText: string;
  onCopy: () => void;
  copied: boolean;
};

export const ShareActions: React.FC<ShareActionsProps> = ({
  shareText,
  onCopy,
  copied,
}) => {
  const { t } = useTranslations();

  const getShareUrl = () =>
    typeof window !== "undefined" ? window.location.href : "";

  const shareToTwitter = () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText,
      )}&url=${encodeURIComponent(shareUrl)}`,
      "_blank",
    );
  };

  const shareToLinkedIn = () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl,
      )}`,
      "_blank",
    );
  };

  const shareToFacebook = () => {
    const shareUrl = getShareUrl();
    if (!shareUrl) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl,
      )}`,
      "_blank",
    );
  };

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 text-sm font-semibold">
        <Share2 className="w-4 h-4" />
        {t.share_title}
      </h4>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={shareToTwitter}
          className="hover:bg-[#1DA1F2]/10 hover:border-[#1DA1F2]/50 hover:text-[#1DA1F2]"
        >
          <Twitter className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={shareToLinkedIn}
          className="hover:bg-[#0A66C2]/10 hover:border-[#0A66C2]/50 hover:text-[#0A66C2]"
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={shareToFacebook}
          className="hover:bg-[#1877F2]/10 hover:border-[#1877F2]/50 hover:text-[#1877F2]"
        >
          <Facebook className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onCopy}
          className={copied ? "bg-primary/10 border-primary/50 text-primary" : ""}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="sr-only">{t.share_copied}</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              <span className="sr-only">{t.share_title}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
