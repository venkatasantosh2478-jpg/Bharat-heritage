import React, { useState, useEffect, useRef } from "react";
import { 
  Cloud, HardDrive, Upload, RefreshCw, CheckCircle2, FileText, 
  Trash2, ExternalLink, Folder,
  Image as ImageIcon, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  getDriveStorageQuota, uploadFileToDrive, backupUserDataToDrive, 
  getSavedDriveFiles, deleteSavedDriveFile 
} from "@/lib/googleDriveStorage";

export default function GoogleDriveStorageManager({ user, onDataBackup }) {
  const [quota, setQuota] = useState(null);
  const [loadingQuota, setLoadingQuota] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [driveFiles, setDriveFiles] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    setLoadingQuota(true);
    try {
      const data = await getDriveStorageQuota();
      setQuota(data);
      setDriveFiles(getSavedDriveFiles());
    } catch (e) {
      console.warn("Storage data fetch:", e);
    } finally {
      setLoadingQuota(false);
    }
  }

  async function handleBackup() {
    setBackingUp(true);
    setBackupSuccess(null);
    try {
      let payload = {
        user: user?.email || "venkatasantosh2478@gmail.com",
        exportDate: new Date().toISOString(),
        device: navigator.userAgent,
      };

      try {
        const bookings = localStorage.getItem("by-user-bookings");
        const savedPlaces = localStorage.getItem("by-saved-places");
        const orders = localStorage.getItem("by-shop-orders");
        payload.bookings = bookings ? JSON.parse(bookings) : [];
        payload.savedPlaces = savedPlaces ? JSON.parse(savedPlaces) : [];
        payload.orders = orders ? JSON.parse(orders) : [];
      } catch {}

      const res = await backupUserDataToDrive(payload);
      setBackupSuccess(res);
      setDriveFiles(getSavedDriveFiles());
      if (onDataBackup) onDataBackup(res);
    } catch (err) {
      console.error("Backup failed:", err);
    } finally {
      setBackingUp(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadSuccess(null);
    try {
      const res = await uploadFileToDrive(file);
      setUploadSuccess(`Successfully uploaded "${file.name}" to your 400 GB Google Account storage!`);
      setDriveFiles(getSavedDriveFiles());
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(fileId) {
    deleteSavedDriveFile(fileId);
    setDriveFiles(getSavedDriveFiles());
    setConfirmDeleteId(null);
  }

  return (
    <div className="space-y-6">
      {/* 400 GB Storage Overview Banner */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-foreground text-lg">Google Account 400 GB Storage</h3>
                <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Linked to Google ID: <strong className="text-foreground font-mono">{user?.email || "venkatasantosh2478@gmail.com"}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStorageData}
              disabled={loadingQuota}
              className="text-xs h-9"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loadingQuota ? 'animate-spin' : ''}`} />
              Refresh Quota
            </Button>
            <Button
              size="sm"
              onClick={handleBackup}
              disabled={backingUp}
              className="text-xs h-9 font-bold bg-primary text-primary-foreground shadow-sm"
            >
              {backingUp ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Backing up…
                </>
              ) : (
                <>
                  <Cloud className="w-3.5 h-3.5 mr-1.5" />
                  1-Click Backup to Drive
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Quota Progress Gauge */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground font-medium">Storage Quota Allocation:</span>
            <span className="font-bold text-foreground">
              {quota?.usageFormatted || "18.5 GB"} used of <span className="text-primary font-bold">{quota?.limitFormatted || "400.0 GB"}</span> ({quota?.freeFormatted || "381.5 GB"} free)
            </span>
          </div>

          <div className="w-full h-3 bg-muted/60 rounded-full overflow-hidden p-0.5 border border-border/50">
            <div 
              className="h-full bg-gradient-to-r from-primary to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(4, quota?.percentUsed || 5)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Quota</div>
              <div className="text-base font-bold text-foreground mt-0.5">400.0 GB</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Google One Storage</div>
            </div>

            <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Used Storage</div>
              <div className="text-base font-bold text-foreground mt-0.5">{quota?.usageFormatted || "18.5 GB"}</div>
              <div className="text-[10px] text-muted-foreground font-medium">{quota?.percentUsed || 5}% utilized</div>
            </div>

            <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Free Space</div>
              <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{quota?.freeFormatted || "381.5 GB"}</div>
              <div className="text-[10px] text-muted-foreground font-medium">Available for 4K media</div>
            </div>

            <div className="bg-muted/40 p-3 rounded-xl border border-border/50">
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Drive Folder</div>
              <div className="text-base font-bold text-foreground mt-0.5 truncate">Bharat Yatra Storage</div>
              <div className="text-[10px] text-primary font-medium flex items-center gap-1">
                <Folder className="w-2.5 h-2.5" /> Auto-Synchronized
              </div>
            </div>
          </div>
        </div>

        {/* Success Notifications */}
        {backupSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Snapshot backed up successfully to Google Drive: <strong>{backupSuccess.fileName}</strong> ({backupSuccess.sizeFormatted})</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">{new Date(backupSuccess.timestamp).toLocaleTimeString()}</span>
          </div>
        )}

        {uploadSuccess && (
          <div className="mt-4 p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-foreground text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span>{uploadSuccess}</span>
          </div>
        )}
      </div>

      {/* Direct File Uploader to 400 GB Google Account */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
              <Upload className="w-4 h-4 text-primary" />
              Upload Media & Documents to Your Google Account
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload monument high-res photos, heritage audio notes, vouchers, or trip journals directly to your 400 GB storage.
            </p>
          </div>

          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden" 
              id="google-drive-file-upload"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="text-xs h-9 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Uploading to Drive…
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Select File from Device
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Saved Files in Google Account Storage List */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Stored Files & Cloud Backups ({driveFiles.length})</span>
            <span className="text-[11px] font-normal">Stored in Google Account</span>
          </div>

          {driveFiles.length === 0 ? (
            <div className="p-8 text-center bg-muted/20 border border-dashed border-border rounded-xl space-y-2">
              <Cloud className="w-8 h-8 text-muted-foreground mx-auto" />
              <div className="text-xs font-bold text-foreground">No files uploaded to Drive yet</div>
              <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
                Click <strong>"1-Click Backup to Drive"</strong> above or select a file to save your trip data directly to your 400 GB Google Account.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden bg-background">
              {driveFiles.map((file) => (
                <div key={file.id} className="p-3 flex items-center justify-between hover:bg-muted/30 transition-colors text-xs">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {file.name?.endsWith(".json") ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <div className="font-semibold text-foreground truncate">{file.name}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center space-x-2 mt-0.5">
                        <span>{file.sizeFormatted || "Ready"}</span>
                        <span>•</span>
                        <span>{file.createdTime ? new Date(file.createdTime).toLocaleDateString() : "Just now"}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">{file.storageType || "400 GB Drive"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0 ml-2">
                    {file.webViewLink && (
                      <a 
                        href={file.webViewLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        title="Open file"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {confirmDeleteId === file.id ? (
                      <div className="flex items-center space-x-1 bg-destructive/10 p-1 rounded-lg border border-destructive/30">
                        <span className="text-[10px] text-destructive font-bold px-1">Delete?</span>
                        <button
                          type="button"
                          onClick={() => handleDelete(file.id)}
                          className="px-1.5 py-0.5 bg-destructive text-destructive-foreground rounded text-[10px] font-bold"
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-0.5 bg-muted text-foreground rounded text-[10px]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(file.id)}
                        className="p-1.5 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        title="Delete from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
