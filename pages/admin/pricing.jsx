import { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

// 🧠 Klient React Query
const queryClient = new QueryClient();

// 🔧 Pomocnicze funkcje API
const fetchAPI = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Błąd sieci");
  return res.json();
};

const postEstimate = async (data) => {
  const res = await fetch("http://localhost:3001/pricing/estimate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Błąd wyceny");
  return res.json();
};

// 🧮 Główny komponent ekranu wyceny
function PricingPage() {
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState({
    modelId: "",
    engineId: "",
    transmissionId: "",
    serviceId: "",
  });

  // 📦 Pobieranie danych z backendu (React Query v5 syntax)
  const {
    data: models,
    isLoading: modelsIsLoading,
    isError: modelsError,
  } = useQuery({
    queryKey: ["models"],
    queryFn: () => fetchAPI("http://localhost:3001/pricing/models"),
  });

  const {
    data: services,
    isLoading: servicesIsLoading,
    isError: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchAPI("http://localhost:3001/pricing/services"),
  });

  const {
    data: engines,
    isLoading: enginesIsLoading,
    isError: enginesError,
  } = useQuery({
    queryKey: ["engines", selected.modelId],
    queryFn: () => fetchAPI(`http://localhost:3001/pricing/engines/${selected.modelId}`),
    enabled: !!selected.modelId,
  });

  const {
    data: transmissions,
    isLoading: transmissionsIsLoading,
    isError: transmissionsError,
  } = useQuery({
    queryKey: ["transmissions", selected.engineId],
    queryFn: () => fetchAPI(`http://localhost:3001/pricing/transmissions/${selected.engineId}`),
    enabled: !!selected.engineId,
  });

  // 🧮 Mutacja wyceny (nowy styl)
  const estimateMutation = useMutation({
    mutationFn: postEstimate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["estimate"] }),
  });

  const handleEstimate = () => {
    if (!selected.modelId || !selected.engineId || !selected.transmissionId || !selected.serviceId) {
      alert("Proszę wybrać wszystkie pola przed wyceną.");
      return;
    }
    estimateMutation.mutate(selected);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-blue-400">🔧 Wycena serwisowa Subaru</h1>

      {/* Formularz wyboru */}
      <div className="bg-[#111a2b] border border-blue-500/20 rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* --- MODEL --- */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Model</label>
            {modelsIsLoading ? (
              <p className="text-gray-500 text-sm italic">⏳ Ładowanie modeli...</p>
            ) : modelsError ? (
              <p className="text-red-500 text-sm">❌ Błąd ładowania modeli.</p>
            ) : (
              <select
                value={selected.modelId}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    modelId: e.target.value,
                    engineId: "",
                    transmissionId: "",
                  })
                }
                className="w-full bg-[#1c2541] border border-blue-500/20 rounded-lg p-2 outline-none"
              >
                <option value="">-- Wybierz model --</option>
                {(models?.value || models || []).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* --- SILNIK --- */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Silnik</label>
            {enginesIsLoading ? (
              <p className="text-gray-500 text-sm italic">⏳ Ładowanie silników...</p>
            ) : enginesError ? (
              <p className="text-red-500 text-sm">❌ Błąd ładowania silników.</p>
            ) : (
              <select
                value={selected.engineId}
                onChange={(e) =>
                  setSelected({
                    ...selected,
                    engineId: e.target.value,
                    transmissionId: "",
                  })
                }
                className="w-full bg-[#1c2541] border border-blue-500/20 rounded-lg p-2 outline-none"
                disabled={!selected.modelId}
              >
                <option value="">-- Wybierz silnik --</option>
                {(engines?.value || engines || []).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* --- SKRZYNIA --- */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Skrzynia biegów</label>
            {transmissionsIsLoading ? (
              <p className="text-gray-500 text-sm italic">⏳ Ładowanie skrzyń...</p>
            ) : transmissionsError ? (
              <p className="text-red-500 text-sm">❌ Błąd ładowania skrzyń.</p>
            ) : (
              <select
                value={selected.transmissionId}
                onChange={(e) =>
                  setSelected({ ...selected, transmissionId: e.target.value })
                }
                className="w-full bg-[#1c2541] border border-blue-500/20 rounded-lg p-2 outline-none"
                disabled={!selected.engineId}
              >
                <option value="">-- Wybierz skrzynię --</option>
                {(transmissions?.value || transmissions || []).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* --- USŁUGA --- */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Usługa serwisowa</label>
            {servicesIsLoading ? (
              <p className="text-gray-500 text-sm italic">⏳ Ładowanie usług...</p>
            ) : servicesError ? (
              <p className="text-red-500 text-sm">❌ Błąd ładowania usług.</p>
            ) : (
              <select
                value={selected.serviceId}
                onChange={(e) => setSelected({ ...selected, serviceId: e.target.value })}
                className="w-full bg-[#1c2541] border border-blue-500/20 rounded-lg p-2 outline-none"
              >
                <option value="">-- Wybierz usługę --</option>
                {(services?.value || services || []).map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* --- PRZYCISK --- */}
        <div className="text-center mt-8">
          <button
            onClick={handleEstimate}
            disabled={estimateMutation.isPending}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-white transition disabled:bg-gray-600"
          >
            {estimateMutation.isPending ? "⏳ Obliczanie..." : "⚙️ Oblicz wycenę"}
          </button>
        </div>

        {/* --- WYNIK WYCENY --- */}
        {estimateMutation.data && (
          <motion.div
            className="mt-10 bg-[#162032] border border-blue-500/20 rounded-xl p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-bold mb-4 text-blue-400">Wynik wyceny</h2>
            <p>💰 Koszt netto: {estimateMutation.data.totalNet.toFixed(2)} PLN</p>
            <p>💸 VAT (23%): {(estimateMutation.data.totalNet * 0.23).toFixed(2)} PLN</p>
            <p className="font-semibold text-green-400">
              💵 Razem brutto: {estimateMutation.data.totalGross.toFixed(2)} PLN
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// 🔁 Owijamy w QueryClientProvider
export default function PricingWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <PricingPage />
    </QueryClientProvider>
  );
}
