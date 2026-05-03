import { prisma } from "@/lib/prisma";
import PaymentConfigForm from "./PaymentConfigForm";

export default async function PagamentosPage() {
  const config = await prisma.paymentConfig.findFirst();

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuração de Pagamentos</h1>
        <PaymentConfigForm initialConfig={config} />
      </div>
    </div>
  );
}