"use client";

import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Confetti, type ConfettiRef } from "@/components/ui/confetti";
import { api } from "../../convex/_generated/api";

type Plan = {
  id: string;
  label: string;
  description: string;
  amount: number;
  badge: string;
  perks: string[];
  spotlight?: boolean;
};

const MONTHLY_SERVER_COST_YEN = 500;
const MONTHS_PER_YEAR = 12;
const TARGET_YEARS = 10;
const TARGET_YEN = MONTHLY_SERVER_COST_YEN * MONTHS_PER_YEAR * TARGET_YEARS;
const PERCENT_MAX = 100;
const NAME_MAX_LENGTH = 32;
const MESSAGE_MAX_LENGTH = 60;
const CONFETTI_PARTICLE_COUNT = 160;
const CONFETTI_SPREAD_DEGREES = 72;
const CONFETTI_SPOTLIGHT_SCALAR = 1.4;
const CONFETTI_DEFAULT_SCALAR = 1;
const CONFETTI_START_VELOCITY = 45;
const CONFETTI_TICKS = 220;
const CONFETTI_ORIGIN_Y = 0.3;
const RIBBIT_LITE_AMOUNT = 500;
const PANIC_BUTTON_AMOUNT = 2500;
const FROG_PALACE_AMOUNT = 6000;
const TIME_TRAVEL_AMOUNT = 12_000;
const currency = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
});

// Ensure both server and client render the ASCII yen symbol to prevent hydration mismatches.
const formatCurrency = (amount: number) =>
  currency.format(amount).replace(/\uFFE5/g, "\u00A5");

const plans: Plan[] = [
  {
    id: "ribbit-lite",
    label: "月額監視ライト",
    description: "ワンコインで 1 ヶ月のサーバーを守る、基本のリブート担当。",
    amount: RIBBIT_LITE_AMOUNT,
    badge: "🐸 ワンコイン応援",
    perks: ["消されたメッセージ 1 件の保護", "Kero bot のログ 24h 保証"],
  },
  {
    id: "panic-button",
    label: "メッセージ消去ストッパー",
    description:
      "ケロちゃんが物理的にスマホを投げたときのための非常ボタン予算。",
    amount: PANIC_BUTTON_AMOUNT,
    badge: "🚨 緊急対応枠",
    perks: ["ガチ勢向けログ監査", "削除検知の早朝通知（寝起きボイス風）"],
  },
  {
    id: "frog-palace",
    label: "ケロ宮殿フルサポート",
    description:
      "10 年稼働に向けた本丸。Discord 帝国の平和と笑顔を約束します。",
    amount: FROG_PALACE_AMOUNT,
    badge: "👑 ゴールドバックナー",
    perks: ["年間稼働保証書（PDF）", "ケロ bot の新機能投票券"],
    spotlight: true,
  },
  {
    id: "time-travel",
    label: "タイムパトロール予算",
    description:
      "未来の削除まで先回りする研究開発枠。夢は大きく、ログは永遠に。",
    amount: TIME_TRAVEL_AMOUNT,
    badge: "⏱ 未来技術投資",
    perks: ["メッセージ復元 AI ベータ権", "月例ケロ経済白書 PDF"],
  },
];

export default function Home() {
  const confettiRef = useRef<ConfettiRef>(null);
  const hasRequestedSeed = useRef(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const donations = useQuery(api.donations.list);
  const ensureSampleData = useMutation(api.donations.ensureSampleData);
  const createDonation = useMutation(api.donations.create);

  useEffect(() => {
    if (donations && donations.length === 0 && !hasRequestedSeed.current) {
      hasRequestedSeed.current = true;
      ensureSampleData().catch(() => {
        // best-effort seeding; ignore failures so the page stays usable
      });
    }
  }, [donations, ensureSampleData]);

  const donationList = donations ?? [];

  const totalAmount = useMemo(
    () => donationList.reduce((sum, donation) => sum + donation.amount, 0),
    [donationList]
  );

  const progress = Math.min(
    Math.round((totalAmount / TARGET_YEN) * PERCENT_MAX),
    PERCENT_MAX
  );
  const remaining = Math.max(TARGET_YEN - totalAmount, 0);
  const supportersCount = donationList.length;

  const handleDonate = async (plan: Plan) => {
    if (pendingPlanId) {
      return;
    }

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const placeholderName = trimmedName.length > 0 ? trimmedName : "匿名カエル";

    setPendingPlanId(plan.id);
    try {
      await createDonation({
        name: placeholderName,
        planId: plan.id,
        planLabel: plan.label,
        amount: plan.amount,
        message: trimmedMessage.length > 0 ? trimmedMessage : undefined,
      });
      setName("");
      setMessage("");
      setErrorMessage(null);
      confettiRef.current?.fire({
        particleCount: CONFETTI_PARTICLE_COUNT,
        spread: CONFETTI_SPREAD_DEGREES,
        scalar: plan.spotlight
          ? CONFETTI_SPOTLIGHT_SCALAR
          : CONFETTI_DEFAULT_SCALAR,
        startVelocity: CONFETTI_START_VELOCITY,
        ticks: CONFETTI_TICKS,
        colors: ["#32CD5E", "#111827", "#F7FEE7", "#A855F7"],
        origin: { y: CONFETTI_ORIGIN_Y },
      });
    } catch (_error) {
      setErrorMessage(
        "寄付の保存に失敗しました。少し待ってから再度お試しください。"
      );
    } finally {
      setPendingPlanId(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),transparent_55%)]" />
      <Confetti
        className="pointer-events-none fixed inset-0 z-50 h-full w-full"
        manualstart
        ref={confettiRef}
      />
      <main className="relative z-10">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pt-16 pb-20 sm:px-8 md:pt-24">
          <header className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 font-medium text-emerald-900 text-sm shadow-sm">
                <span className="text-lg">🐸</span>
                ケロちゃん bot 維持クラファン
              </span>
              <h1 className="text-balance font-semibold text-4xl tracking-tight sm:text-5xl">
                消したはずのメッセージ、
                <span className="text-emerald-600">未来に残そう</span>
              </h1>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                ケロちゃんが削除したメッセージを全力でログに残すための冗談半分の本気プロジェクトです。
                サーバー代は月 500 円。10 年分の 60,000
                円をみんなで楽しく集めましょう。
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard
                  caption={`目標まであと ${formatCurrency(remaining)}`}
                  label="現在の支援総額"
                  value={formatCurrency(totalAmount)}
                />
                <StatCard
                  caption="目標 60,000 円中"
                  label="進捗率"
                  value={`${progress}%`}
                />
                <StatCard
                  caption="みんなでケロちゃんを見守り中"
                  label="支援者"
                  value={`${supportersCount} 名`}
                />
              </div>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-emerald-100 bg-white/70 shadow-xl backdrop-blur">
                <div className="-top-6 absolute right-6 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-1 font-semibold text-sm text-white shadow-lg">
                  <span>10 年運用まで</span>
                </div>
                <Image
                  alt="ケロちゃんのアイコン"
                  className="h-full w-full object-cover"
                  height={540}
                  priority
                  src="/kero.jpeg"
                  width={540}
                />
                <div className="space-y-3 px-6 pt-5 pb-6">
                  <p className="text-muted-foreground text-sm">
                    ケロちゃん bot が 1 ヶ月に守るログ件数（概算）
                  </p>
                  <ProgressBar progress={progress} />
                  <div className="flex items-center justify-between font-medium text-sm">
                    <span>進捗 {progress}%</span>
                    <span>目標 {formatCurrency(TARGET_YEN)}</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-8 rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-lg backdrop-blur sm:p-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <h2 className="font-semibold text-2xl tracking-tight sm:text-3xl">
                プランを選んでケロちゃんを応援しよう
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                支援者名と一言コメントを添えてボタンを押すと、その場で支援が反映されてコンフェッティが舞います。実際のお金はかかりません。ケロちゃんに愛を込めてクリックしましょう。
              </p>
              {errorMessage ? (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-destructive text-sm">
                  {errorMessage}
                </p>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 font-medium text-foreground text-sm">
                  支援者の名前
                  <input
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-base shadow-sm outline-none transition focus-visible:ring focus-visible:ring-emerald-300 sm:text-sm"
                    maxLength={NAME_MAX_LENGTH}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="例: ケロロ参謀"
                    value={name}
                  />
                </label>
                <label className="grid gap-2 font-medium text-foreground text-sm">
                  一言コメント（任意）
                  <input
                    className="w-full rounded-md border border-border bg-white px-3 py-2 text-base shadow-sm outline-none transition focus-visible:ring focus-visible:ring-emerald-300 sm:text-sm"
                    maxLength={MESSAGE_MAX_LENGTH}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="例: 消すな！いや消して！"
                    value={message}
                  />
                </label>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                {plans.map((plan) => (
                  <article
                    className={`group flex h-full flex-col justify-between rounded-2xl border p-6 transition duration-200 ${
                      plan.spotlight
                        ? "border-emerald-500 bg-emerald-50 shadow-emerald-100/60 shadow-lg"
                        : "border-border bg-white/80 hover:border-emerald-400 hover:bg-emerald-50/80"
                    }`}
                    key={plan.id}
                  >
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 text-xs">
                        {plan.badge}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{plan.label}</h3>
                        <p className="mt-2 text-muted-foreground text-sm">
                          {plan.description}
                        </p>
                      </div>
                      <p className="font-semibold text-2xl">
                        {formatCurrency(plan.amount)}
                      </p>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        {plan.perks.map((perk) => (
                          <li className="flex items-start gap-2" key={perk}>
                            <span className="mt-1 inline-block size-2 rounded-full bg-emerald-400" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      className="mt-6"
                      disabled={pendingPlanId !== null}
                      onClick={() => handleDonate(plan)}
                      size="lg"
                      variant={plan.spotlight ? "default" : "outline"}
                    >
                      {pendingPlanId === plan.id
                        ? "処理中…"
                        : "このプランで応援する"}
                    </Button>
                  </article>
                ))}
              </div>
            </div>
            <aside className="space-y-6 rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-inner">
              <div>
                <h2 className="font-semibold text-xl">最新の支援コメント</h2>
                <p className="mt-2 text-muted-foreground text-sm">
                  ボタンを押すとここに追加されます。削除しても bot
                  が覚えてるよ。
                </p>
              </div>
              <div className="space-y-4">
                {donationList.length === 0 ? (
                  <p className="text-center text-muted-foreground text-sm">
                    まだ支援がありません。最初のカエルになろう！
                  </p>
                ) : (
                  donationList.map((donation) => {
                    const createdAt =
                      donation.createdAt ?? donation._creationTime;
                    return (
                      <div
                        className="rounded-xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-sm"
                        key={donation._id}
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-semibold text-emerald-900">
                            {donation.name}
                          </span>
                          <time
                            className="text-muted-foreground text-xs"
                            dateTime={new Date(createdAt).toISOString()}
                          >
                            {new Date(createdAt).toLocaleString("ja-JP", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </time>
                        </div>
                        <p className="mt-1 text-emerald-800 text-sm">
                          {donation.planLabel} /{" "}
                          {formatCurrency(donation.amount)}
                        </p>
                        {donation.message ? (
                          <p className="mt-2 text-muted-foreground text-sm">
                            “{donation.message}”
                          </p>
                        ) : (
                          <p className="mt-2 text-muted-foreground text-xs">
                            コメントは後で編集予定（削除禁止）
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </aside>
          </section>
        </section>
        <footer className="border-emerald-100 border-t bg-white/80 py-8 text-muted-foreground text-sm">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-2 px-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <p>
              ケロちゃん bot プロジェクトは Discord
              内輪ネタのジョークサイトです。
            </p>
            <p>© {new Date().getFullYear()} Kero Preservation Team</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  caption: string;
};

function StatCard({ label, value, caption }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white/80 p-4 shadow-sm sm:p-5">
      <p className="font-medium text-muted-foreground text-sm">{label}</p>
      <p className="mt-2 font-semibold text-2xl text-emerald-800">{value}</p>
      <p className="mt-1 text-muted-foreground text-xs">{caption}</p>
    </div>
  );
}

type ProgressBarProps = {
  progress: number;
};

function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-3 w-full rounded-full bg-emerald-100">
      <div
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 transition-all"
        role="progressbar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
