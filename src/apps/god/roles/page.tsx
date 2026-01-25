import { RolesManagement } from '@/features/god/roles/RolesManagement';
import { getRolesAction } from '@/shared/actions/roles';

export const metadata = {
  title: 'Roles & Permissions | God Mode',
  description: 'Manage system roles and access control',
};

export default async function RolesPage() {
  const { data: roles = [] } = await getRolesAction();

  return <RolesManagement initialRoles={roles} />;
}
