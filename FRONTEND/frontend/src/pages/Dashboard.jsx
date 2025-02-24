import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold text-gray-800">Bienvenido al Dashboard</h1>
        <p className="mt-4 text-lg text-gray-600">Aquí podrás gestionar tu inventario.</p>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
