import { ArrowLeft, BadgeIndianRupee, CalendarClock, LocateFixed, ShieldCheck, UserSquare2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { BarcodeCard } from "../components/BarcodeCard";
import { SectionHeader } from "../components/SectionHeader";
import { StatusBadge } from "../components/StatusBadge";
import { Timeline } from "../components/Timeline";
import { calculateAgeYears, formatCurrency, formatDate, getLifecycleRecommendation } from "../lib/formatters";

export function AssetDetailPage({ assets, movementLogs, repairTickets, passiveDevices }) {
  const { assetId } = useParams();
  const asset = assets.find((entry) => entry.id === assetId);

  if (!asset) {
    return (
      <div className="panel page-enter">
        <p className="text-sm text-[var(--color-ink-500)]">Asset not found.</p>
        <Link to="/assets" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)]">
          <ArrowLeft className="size-4" />
          Back to assets
        </Link>
      </div>
    );
  }

  const history = movementLogs
    .filter((entry) => entry.assetId === asset.id)
    .map((entry) => ({
      id: entry.id,
      title: `${entry.type}: ${entry.from} → ${entry.to}`,
      description: `Moved by ${entry.movedBy}.`,
      timestamp: entry.timestamp,
      status: entry.approvalStatus,
      meta: asset.name,
    }));

  const linkedTag = passiveDevices.rfidTags.find((entry) => entry.assetId === asset.id);

  return (
    <div className="space-y-8 page-enter">
      <Link to="/assets" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-brand-700)]">
        <ArrowLeft className="size-4" />
        Back to asset register
      </Link>

      <SectionHeader
        eyebrow="Asset Detail"
        title={asset.name}
        description={asset.notes}
        actions={
          <>
            <StatusBadge value={asset.status} />
            <StatusBadge value={asset.verificationStatus} />
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="panel">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: UserSquare2, label: "Assigned To", value: asset.assignedTo },
              { icon: LocateFixed, label: "Location", value: asset.location },
              { icon: CalendarClock, label: "Purchase Date", value: formatDate(asset.purchaseDate) },
              { icon: BadgeIndianRupee, label: "Asset Value", value: formatCurrency(asset.value) },
            ].map((item) => (
              <div key={item.label} className="panel-alt">
                <item.icon className="size-5 text-[var(--color-brand-700)]" />
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">{item.label}</p>
                <p className="mt-2 font-display text-2xl text-[var(--color-ink-950)]">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              ["Asset ID", asset.id],
              ["Type", asset.type],
              ["Department", asset.department],
              ["Serial", asset.serial],
              ["Vendor", asset.vendor],
              ["Warranty Expiry", formatDate(asset.warrantyExpiry)],
              ["Asset Age", `${calculateAgeYears(asset.purchaseDate)} years`],
              ["Lifecycle", asset.lifecycleStatus],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[1.4rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-400)]">{label}</p>
                <p className="mt-2 font-semibold text-[var(--color-ink-950)]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[1.7rem] border border-[var(--color-brand-200)] bg-[var(--color-brand-50)] p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-5 text-[var(--color-brand-700)]" />
              <div>
                <p className="font-semibold text-[var(--color-ink-950)]">Lifecycle recommendation</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">{getLifecycleRecommendation(asset)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-600)]">QR Identity</p>
            <div className="mt-4 flex justify-center rounded-[1.75rem] border border-dashed border-[var(--color-brand-200)] bg-white p-6">
              <QRCodeSVG value={`${asset.id}:${asset.name}:${asset.location}`} size={180} fgColor="#10243f" bgColor="#ffffff" />
            </div>
          </div>
          <BarcodeCard value={asset.id} label="Barcode Signature" />
          {linkedTag ? (
            <div className="panel-alt">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-ink-400)]">Linked RFID Tag</p>
              <p className="mt-2 font-display text-2xl text-[var(--color-ink-950)]">{linkedTag.id}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-ink-500)]">
                Last ping from {linkedTag.location} with {linkedTag.battery}% battery reserve.
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-600)]">Movement History</p>
          <h2 className="mt-2 font-display text-2xl text-[var(--color-ink-950)]">Timeline of custody and movement</h2>
          <div className="mt-6">
            <Timeline items={history.length ? history : [{ id: "empty", title: "No movements logged", description: "This asset has not recorded any internal movement yet.", timestamp: new Date().toISOString(), status: "Verified" }]} />
          </div>
        </div>

        <div className="panel">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-600)]">Repair Record</p>
          <h2 className="mt-2 font-display text-2xl text-[var(--color-ink-950)]">Tickets and maintenance history</h2>
          <div className="mt-6 space-y-4">
            {repairTickets.filter((ticket) => ticket.assetId === asset.id).map((ticket) => (
              <div key={ticket.id} className="rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-shell-50)]/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-[var(--color-ink-950)]">{ticket.issue}</p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">
                      Technician {ticket.technician} • Opened {formatDate(ticket.openedAt)}
                    </p>
                  </div>
                  <StatusBadge value={ticket.status} />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-[var(--color-ink-500)]">
                  <span>ETA {formatDate(ticket.eta)}</span>
                  <span className="font-semibold text-[var(--color-ink-950)]">{formatCurrency(ticket.cost)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
