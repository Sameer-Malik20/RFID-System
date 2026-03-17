import { useState } from "react";
import { AlarmClockCheck, BadgeInfo, RadioTower, ScanLine } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { BarcodeCard } from "../components/BarcodeCard";
import { DataTable } from "../components/DataTable";
import { SectionHeader } from "../components/SectionHeader";
import { formatDateTime } from "../lib/formatters";

export function PassiveDevicesPage({ assets, passiveDevices }) {
  const [assetId, setAssetId] = useState(assets[0]?.id ?? "");
  const selectedAsset = assets.find((asset) => asset.id === assetId) ?? assets[0];

  const tagColumns = [
    { key: "id", label: "Tag ID" },
    { key: "assetId", label: "Linked Asset" },
    { key: "location", label: "Last Ping Location" },
    { key: "battery", label: "Battery", render: (row) => `${row.battery}%`, sortValue: (row) => row.battery },
    { key: "lastPing", label: "Last Ping", render: (row) => formatDateTime(row.lastPing), sortValue: (row) => row.lastPing },
  ];
  const beaconColumns = [
    { key: "id", label: "Beacon ID" },
    { key: "zone", label: "Zone" },
    { key: "signalStrength", label: "Signal", render: (row) => `${row.signalStrength} dBm`, sortValue: (row) => row.signalStrength },
    { key: "lastSeen", label: "Last Seen", render: (row) => formatDateTime(row.lastSeen), sortValue: (row) => row.lastSeen },
  ];
  const hooterColumns = [
    { key: "id", label: "Alarm ID" },
    { key: "location", label: "Location" },
    { key: "severity", label: "Severity" },
    { key: "lastTriggered", label: "Last Triggered", render: (row) => formatDateTime(row.lastTriggered), sortValue: (row) => row.lastTriggered },
  ];

  return (
    <div className="space-y-8 page-enter">
      <SectionHeader
        eyebrow="Passive Devices"
        title="RFID and passive device control plane"
        description="Monitor RFID tags, beacons, hooters, and on-demand QR/barcode identity for every tracked asset."
      />

      <div className="grid gap-5 md:grid-cols-3">
        <div className="panel-alt">
          <ScanLine className="size-5 text-[var(--color-brand-700)]" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{passiveDevices.rfidTags.length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">RFID tags with live battery and ping telemetry.</p>
        </div>
        <div className="panel-alt">
          <RadioTower className="size-5 text-[var(--color-brand-700)]" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{passiveDevices.beacons.length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Beacon zones tracking asset presence signals.</p>
        </div>
        <div className="panel-alt">
          <AlarmClockCheck className="size-5 text-[var(--color-brand-700)]" />
          <p className="mt-3 font-display text-3xl text-[var(--color-ink-950)]">{passiveDevices.hooters.length}</p>
          <p className="mt-1 text-sm text-[var(--color-ink-500)]">Active hooters and alarm points in the estate.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <DataTable title="RFID tags" description="Linked tag identity, location, and battery health." rows={passiveDevices.rfidTags} columns={tagColumns} searchableFields={["id", "assetId", "location"]} />
          <DataTable title="Beacons" description="Zone coverage and recent sightings." rows={passiveDevices.beacons} columns={beaconColumns} searchableFields={["id", "zone"]} />
          <DataTable title="Hooters / alarms" description="Alarm points and latest trigger records." rows={passiveDevices.hooters} columns={hooterColumns} searchableFields={["id", "location", "severity"]} />
        </div>

        <div className="space-y-6">
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-600)]">Identity Rendering</p>
            <h2 className="mt-2 font-display text-2xl text-[var(--color-ink-950)]">QR and barcode display</h2>
            <div className="mt-4">
              <select value={assetId} onChange={(event) => setAssetId(event.target.value)} className="select-field">
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.id} • {asset.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-6 rounded-[1.75rem] border border-dashed border-[var(--color-brand-200)] bg-white p-6">
              <div className="flex justify-center">
                <QRCodeSVG value={`${selectedAsset.id}:${selectedAsset.name}:${selectedAsset.location}`} size={180} fgColor="#10243f" bgColor="#ffffff" />
              </div>
              <div className="mt-4 rounded-[1.3rem] bg-[var(--color-shell-50)]/80 px-4 py-3 text-sm text-[var(--color-ink-600)]">
                <p className="font-semibold text-[var(--color-ink-950)]">{selectedAsset.name}</p>
                <p>{selectedAsset.location}</p>
              </div>
            </div>
          </div>
          <BarcodeCard value={selectedAsset.id} label="Barcode Signature" />
          <div className="panel-alt">
            <div className="flex gap-3">
              <BadgeInfo className="mt-1 size-5 text-[var(--color-brand-700)]" />
              <div>
                <p className="font-semibold text-[var(--color-ink-950)]">Linked asset context</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-ink-500)]">
                  {selectedAsset.name} belongs to {selectedAsset.department} and is currently marked {selectedAsset.status.toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
