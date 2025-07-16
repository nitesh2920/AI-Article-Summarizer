"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, FileText, Loader2, Sun, Moon, Link } from "lucide-react";

import axios from "axios";

export default function SummaryClient() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Function to clean up markdown formatting
  const cleanMarkdown = (text: string) => {
    return text.replace("/**(.*?)**/g", "$1");
  };

  const fetchSummary = async () => {
    if (!url.trim()) return;

    setError("");
    setLoading(true);
    setSummary("");

    try {
      const cached = localStorage.getItem(`summary-${url}`);
      if (cached) {
        setSummary(cached);
        setLoading(false);
        return;
      }

      const options = {
        method: "GET",
        url: "https://ai-article-extractor-and-summarizer.p.rapidapi.com/summarize",
        params: {
          url,
          summarize: "true"
        },
        headers: {
          "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
          "x-rapidapi-host":
            "ai-article-extractor-and-summarizer.p.rapidapi.com"
        }
      };

      const response = await axios.request(options);
      const cleaned = cleanMarkdown(
        response.data.summary || "No summary available."
      );

      localStorage.setItem(`summary-${url}`, cleaned);
      setSummary(cleaned);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch summary. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Article Summarizer
            </h1>
            <Button
              onClick={() => setDarkMode(!darkMode)}
              variant="ghost"
              size="icon"
              className={`ml-4 ${
                darkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
          <p
            className={`text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Transform lengthy articles into concise, digestible summaries
          </p>
        </div>

        {/* Main Card */}
        <Card
          className={`backdrop-blur-sm border-0 shadow-2xl transition-colors duration-300 ${
            darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80"
          }`}
        >
          <CardHeader className="pb-6">
            <CardTitle
              className={`flex items-center gap-2 text-xl ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Link className="w-5 h-5 text-blue-600" />
              Enter Article URL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className={`pl-4 pr-4 py-3 text-lg border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              <Button
                onClick={fetchSummary}
                disabled={loading || !url.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Summarizing...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Summarize Article
                  </>
                )}
              </Button>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                className={`transition-colors duration-300 ${
                  darkMode
                    ? "border-red-800 bg-red-900/30"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <AlertDescription
                  className={darkMode ? "text-red-300" : "text-red-700"}
                >
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {summary && (
              <Card
                className={`transition-colors duration-300 ${
                  darkMode
                    ? "bg-gradient-to-r from-gray-800 to-purple-900/30 border-gray-700"
                    : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
                }`}
              >
                <CardHeader className="pb-4">
                  <CardTitle
                    className={`flex items-center gap-2 text-lg ${
                      darkMode ? "text-white" : "text-gray-800"
                    }`}
                  >
                    <FileText className="w-5 h-5 text-blue-600" />
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p
                      className={`leading-relaxed whitespace-pre-line text-base ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {summary}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    Analyzing article content...
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          <Card
            className={`text-center p-6 backdrop-blur-sm border-0 shadow-lg transition-colors duration-300 ${
              darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/60"
            }`}
          >
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3
              className={`font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Instant Results
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Get concise summaries in seconds, not minutes
            </p>
          </Card>

          <Card
            className={`text-center p-6 backdrop-blur-sm border-0 shadow-lg transition-colors duration-300 ${
              darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/60"
            }`}
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="w-6 h-6 text-green-600" />
            </div>
            <h3
              className={`font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Any URL
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Works with articles from any website or blog
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
