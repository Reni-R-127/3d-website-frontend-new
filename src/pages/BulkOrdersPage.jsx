import BulkOrderForm from "../components/BulkOrderPage/BulkOrderForm/BulkOrderForm";
import BulkOrderHero from "../components/BulkOrderPage/BulkOrderHero/BulkOrderHero";

export default function BulkOrdersPage() {
  return (
    <main>
      <BulkOrderHero />
      <BulkOrderForm />
    </main>
  );
}