import { useState } from "react";
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

  const [{ status, response }, makeRequest] = useApiRequest("/sdk/create-app", {
    verb: "post",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await makeRequest("/sdk/create-app", {
        verb: "post",
        params: {
          appName,
          allowedUrl,
        },
      });

      // Assuming the API response contains the apiKey
      if (response?.data?.apiKey) {
        setCreatedApp({
          appName,
          apiKey: response.data.apiKey,
        });
        setIsDialogOpen(false);
        setAppName("");
        setAllowedUrl("");
      }
    } catch (error) {
      console.error("Error creating app:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-[#0D0C11] p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">SDK Dashboard</h1>

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

        {createdApp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/[0.08] border border-white/[0.08] rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">
              App Created Successfully
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">App Name</p>
                <p className="text-lg text-white font-medium">
                  {createdApp.appName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">API Key</p>
                <div className="bg-white/[0.05] border border-white/[0.08] rounded p-3">
                  <code className="text-green-400 break-all font-mono text-sm">
                    {createdApp.apiKey}
                  </code>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === "ERROR" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400"
          >
            Error creating app. Please try again.
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SDKDashboard;
