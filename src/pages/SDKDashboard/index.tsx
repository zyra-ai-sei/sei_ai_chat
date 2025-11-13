import { useEffect, useState } from "react";
import { useApiRequest } from "@/hooks/useApiRequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { axiosInstance } from "@/services/axios";

interface CreatedApp {
  appName: string;
  apiKey: string;
}

const SDKDashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [allowedUrl, setAllowedUrl] = useState("");
  const [createdApp, setCreatedApp] = useState<CreatedApp | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keys, setKeys] = useState<any>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.post("/apikeys", {
        appName: appName,
        allowedOrigins: [allowedUrl],
      });

      if (response.data.data.apiKey) {
        setKeys([...keys, { appName: appName, apiKey: response.data.data.apiKey }]);
      } else {
      }
    } catch (err) {}
    setIsSubmitting(false);
    setIsDialogOpen(false);
  };

  useEffect(() => {
    async function getKeys() {
      const response = await axiosInstance.get("/apikeys");

      console.log("response apikye", response.data.data.items);
      setKeys(response.data.data.items);
    }
    getKeys();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-[#0D0C11] p-6"
    >
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold text-white">SDK Dashboard</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-8">Create New App</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-[#1A1A1F] border-white/[0.08] text-white">
            <DialogHeader>
              <DialogTitle className="text-white">Create New App</DialogTitle>
              <DialogDescription className="text-gray-400">
                Enter your app details below to generate an API key.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="app-name" className="text-white">
                    App Name
                  </Label>
                  <Input
                    id="app-name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="My App"
                    required
                    className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="allowed-url" className="text-white">
                    Allowed URL
                  </Label>
                  <Input
                    id="allowed-url"
                    value={allowedUrl}
                    onChange={(e) => setAllowedUrl(e.target.value)}
                    placeholder="https://example.com"
                    required
                    className="bg-white/[0.05] border-white/[0.08] text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {keys?.map((key: any) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/[0.08] border border-white/[0.08] rounded-lg p-3 m-3 "
          >
            <div className="flex items-center justify-between w-full gap-3 ">
              <div>
                <p className="mb-1 text-sm text-gray-400">App Name</p>
                <p className="text-white font-mdmedium ">{key?.appName}</p>
              </div>
              <div>
                <p className="mb-1 text-sm text-gray-400">API Key</p>
                <div className="bg-white/[0.05] border border-white/[0.08] rounded p-3">
                  <code className="font-mono text-sm text-green-400 break-all">
                    {key.apiKey}
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {status === "ERROR" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 text-red-400 border rounded-lg bg-red-500/10 border-red-500/20"
          >
            Error creating app. Please try again.
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SDKDashboard;
