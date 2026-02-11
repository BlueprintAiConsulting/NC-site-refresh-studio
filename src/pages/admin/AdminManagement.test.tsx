import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  toastMock: vi.fn(),
  listAdminAccountsMock: vi.fn(),
  addLocalAdminAccountMock: vi.fn(),
  removeLocalAdminAccountMock: vi.fn(),
  resetLocalAdminPasswordMock: vi.fn(),
  getConfiguredAdminMock: vi.fn(),
  useAuthMock: vi.fn(),
  canAdminResetPasswordMock: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: mocks.toastMock }),
}));

vi.mock("@/components/Header", () => ({ Header: () => <div data-testid="header" /> }));
vi.mock("@/components/Footer", () => ({ Footer: () => <div data-testid="footer" /> }));

vi.mock("@/contexts/useAuth", () => ({
  useAuth: () => mocks.useAuthMock(),
}));

vi.mock("@/lib/admin-auth", () => ({
  listAdminAccounts: mocks.listAdminAccountsMock,
  addLocalAdminAccount: mocks.addLocalAdminAccountMock,
  removeLocalAdminAccount: mocks.removeLocalAdminAccountMock,
  resetLocalAdminPassword: mocks.resetLocalAdminPasswordMock,
  getConfiguredAdmin: mocks.getConfiguredAdminMock,
  canAdminResetPassword: mocks.canAdminResetPasswordMock,
  SUPER_ADMIN_EMAIL: "drewhufnagle@gmail.com",
}));

describe("AdminManagement", () => {
  beforeEach(() => {
    mocks.toastMock.mockReset();
    mocks.listAdminAccountsMock.mockReset();
    mocks.addLocalAdminAccountMock.mockReset();
    mocks.removeLocalAdminAccountMock.mockReset();
    mocks.resetLocalAdminPasswordMock.mockReset();
    mocks.getConfiguredAdminMock.mockReset();
    mocks.useAuthMock.mockReset();
    mocks.canAdminResetPasswordMock.mockReset();

    mocks.useAuthMock.mockReturnValue({
      user: { email: "editor@example.com", id: "admin:editor@example.com" },
      session: null,
      isAdmin: true,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    mocks.getConfiguredAdminMock.mockReturnValue({
      email: "owner@example.com",
      password: "secret",
      source: "env",
      createdAt: "environment",
    });

    mocks.listAdminAccountsMock.mockReturnValue([
      { email: "owner@example.com", password: "secret", source: "env", createdAt: "environment" },
      { email: "editor@example.com", password: "pw", source: "local", createdAt: new Date().toISOString() },
      { email: "other-admin@example.com", password: "pw", source: "local", createdAt: new Date().toISOString() },
    ]);

    mocks.removeLocalAdminAccountMock.mockReturnValue(true);
    mocks.resetLocalAdminPasswordMock.mockReturnValue(true);
    mocks.canAdminResetPasswordMock.mockImplementation((requesterEmail: string, targetEmail: string) => {
      return requesterEmail === "drewhufnagle@gmail.com" || requesterEmail === targetEmail;
    });
  });

  it("adds a local admin account with email and password", async () => {
    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newadmin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "StrongPassword123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.addLocalAdminAccountMock).toHaveBeenCalledWith(
        "newadmin@example.com",
        "StrongPassword123!",
      );
    });
  });

  it("requires a password when adding admin", async () => {
    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newadmin@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Password required",
        }),
      );
    });

    expect(mocks.addLocalAdminAccountMock).not.toHaveBeenCalled();
  });

  it("allows non-super admins to reset only their own password", async () => {
    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    const resetPasswordInputs = screen.getAllByLabelText(/reset password/i);
    fireEvent.change(resetPasswordInputs[1], {
      target: { value: "UpdatedPass456!" },
    });

    const resetButtons = screen.getAllByRole("button", { name: /reset password/i });
    fireEvent.click(resetButtons[1]);

    await waitFor(() => {
      expect(mocks.resetLocalAdminPasswordMock).toHaveBeenCalledWith(
        "editor@example.com",
        "UpdatedPass456!",
        "editor@example.com",
      );
    });

    expect(resetPasswordInputs[0]).toBeDisabled();
    expect(resetButtons[0]).toBeDisabled();
    expect(resetPasswordInputs[2]).toBeDisabled();
    expect(resetButtons[2]).toBeDisabled();
  });

  it("allows super admin to reset other local admin passwords", async () => {
    mocks.useAuthMock.mockReturnValue({
      user: { email: "drewhufnagle@gmail.com", id: "admin:drewhufnagle@gmail.com" },
      session: null,
      isAdmin: true,
      loading: false,
      signIn: vi.fn(),
      signOut: vi.fn(),
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    const resetPasswordInputs = screen.getAllByLabelText(/reset password/i);
    fireEvent.change(resetPasswordInputs[2], {
      target: { value: "AnotherPass789!" },
    });

    const resetButtons = screen.getAllByRole("button", { name: /reset password/i });
    fireEvent.click(resetButtons[2]);

    await waitFor(() => {
      expect(mocks.resetLocalAdminPasswordMock).toHaveBeenCalledWith(
        "other-admin@example.com",
        "AnotherPass789!",
        "drewhufnagle@gmail.com",
      );
    });

    expect(resetPasswordInputs[0]).toBeDisabled();
    expect(resetButtons[0]).toBeDisabled();
    expect(resetPasswordInputs[1]).toBeEnabled();
    expect(resetButtons[1]).toBeEnabled();
    expect(resetPasswordInputs[2]).toBeEnabled();
    expect(resetButtons[2]).toBeEnabled();
  });

  it("disables remove button for env-configured primary admin", async () => {
    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>,
    );

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons[0]).toBeDisabled();
    expect(removeButtons[1]).toBeEnabled();
  });
});
