import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useEffect, useState } from "react";
const inter = Inter({ subsets: ["latin"] });
import { MoonLoader } from "react-spinners";

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (input.length < 30) setError(false);
  }, [input]);

  const submit = async () => {
    // Check if character limit is exceeded
    if (input.length > 30) return setError(true);

    // Set loading state
    setLoading(true);
    try {
      const res = await fetch("api/book", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      const suggestion: { result: string } = await res.json();

      const { result } = suggestion;
      // console.log("result", result);

      
      
      setSuggestion(result);
    } catch (err) {
      console.log("error", err);
    } finally {
      console.log(suggestion.replaceAll("\n", "").split(/(\d[.]+)/));
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.container + " min-h-screen  bg-gray-100"}>
        <Head>
          <title>Book GPT</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="max-w-7xl bg-gray-100 mx-auto py-12">
          <h2 className="text-2xl font-b  old text-center pb-2">
            Book Recommendation
          </h2>
          {/* Input field for marketing copy */}
          <div className="flex flex-col gap-4 justify-center w-1/3 mx-auto">
            <div className="relative w-full">
              {/* Error message */}
              {error && (
                <p className="text-xs pt-1 text-red-500">
                  Character limit exceeded, please enter less text
                </p>
              )}
              <textarea
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full border-2 border-gray-300 bg-white p-4 rounded-lg text-sm focus:outline-none resize-none"
                placeholder="Enter your topic here"
              />
              {/* Character limit in bottom right of textarea */}
              <div
                className={`absolute ${
                  input.length > 30 ? "text-red-500" : "text-gray-400"
                } bottom-2 right-2 text-xs`}
              >
                <span>{input.length}</span>/30
              </div>
            </div>
            <button
              type="button"
              onClick={submit}
              className="bg-blue-500 h-12 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? (
                <div className="flex justify-center items-center gap-4">
                  <p>Loading...</p>
                  <MoonLoader size={20} color="white" />
                </div>
              ) : (
                "Generate"
              )}
            </button>

            <h4 className="text-lg font-semibold pb-2">Your Books:</h4>
            {/* Output field for marketing copy */}
            {suggestion &&
              suggestion
                // .replaceAll("\n", "")
                // .substring(suggestion.indexOf("") + 3)
                .trimStart()
                .split(/(\d[.]+)/)
                .filter((e) => !e.match(/(\d[.]+)/) && e)
                .map((s, i) => {
                  return (
                    <div className="mt-1" key={i}>
                      <div className="relative hover:shadow-lg  w-full rounded-md shadow  bg-white p-4">
                        <p className="text-sm text-gray-700">
                          {i + 1 + ". " + s}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </>
  );
}