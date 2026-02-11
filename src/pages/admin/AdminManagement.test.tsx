import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

const mocks = vi.hoisted(() => ({
  listUsersMock: vi.fn(),
  createUserMock: vi.fn(),
  insertMock: vi.fn(),
  selectMock: vi.fn(),
  invokeMock: vi.fn(),
  rpcMock: vi.fn(),
  toastMock: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mocks.toastMock,
  }),
}));

vi.mock("@/components/Header", () => ({
  Header: () => <div data-testid="header" />,
}));

vi.mock("@/components/Footer", () => ({
  Footer: () => <div data-testid="footer" />,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      admin: {
        listUsers: mocks.listUsersMock,
        createUser: mocks.createUserMock,
        getUserById: vi.fn(),
      },
    },
    functions: {
      invoke: mocks.invokeMock,
    },
    rpc: mocks.rpcMock,
    from: vi.fn(() => ({
      select: mocks.selectMock,
      insert: mocks.insertMock,
    })),
  },
}));

describe("AdminManagement", () => {
  beforeEach(() => {
    mocks.selectMock.mockReset();
    mocks.insertMock.mockReset();
    mocks.listUsersMock.mockReset();
    mocks.createUserMock.mockReset();
    mocks.invokeMock.mockReset();
    mocks.rpcMock.mockReset();
    mocks.toastMock.mockReset();

    mocks.selectMock.mockImplementation((selectArg: string) => {
      if (selectArg === "id, user_id, created_at") {
        return {
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        };
      }

      const roleQuery = {
        eq: vi.fn(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      roleQuery.eq.mockReturnValue(roleQuery);
      return roleQuery;
    });
  });

  it("adds an admin when the user does not yet exist", async () => {
    mocks.invokeMock.mockImplementation((functionName: string) => {
      if (functionName === "list-admins") {
        return Promise.resolve({ data: { admins: [] }, error: null });
      }

      if (functionName === "add-admin") {
        return Promise.resolve({ data: { message: "Admin added" }, error: null });
      }

      return Promise.resolve({ data: null, error: null });
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "NewAdmin@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.invokeMock).toHaveBeenCalledWith("add-admin", {
        body: {
          email: "newadmin@example.com",
          password: null,
          sendInvite: true,
        },
      });
    });
  });

  it("falls back to rpc when edge function is unreachable", async () => {
    mocks.invokeMock.mockImplementation((functionName: string) => {
      if (functionName === "list-admins") {
        return Promise.resolve({ data: { admins: [] }, error: null });
      }

      if (functionName === "add-admin") {
        return Promise.resolve({
          data: null,
          error: new Error("Failed to send a request to the Edge Function"),
        });
      }

      return Promise.resolve({ data: null, error: null });
    });

    mocks.rpcMock.mockResolvedValue({
      data: "newadmin@example.com is now an admin.",
      error: null,
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "NewAdmin@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.rpcMock).toHaveBeenCalledWith("promote_existing_user_to_admin", {
        target_email: "newadmin@example.com",
      });
    });
  });

  it("shows actionable message when fallback rpc is not deployed", async () => {
    mocks.invokeMock.mockImplementation((functionName: string) => {
      if (functionName === "list-admins") {
        return Promise.resolve({ data: { admins: [] }, error: null });
      }

      if (functionName === "add-admin") {
        return Promise.resolve({
          data: null,
          error: new Error("Failed to send a request to the Edge Function"),
        });
      }

      return Promise.resolve({ data: null, error: null });
    });

    mocks.rpcMock.mockResolvedValue({
      data: null,
      error: new Error(
        "Could not find the function public.promote_existing_user_to_admin(target_email) in the schema cache",
      ),
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newadmin@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Failed to add admin",
          description:
            "Fallback admin promotion is not deployed yet. Run the latest Supabase migrations, then try again.",
        }),
      );
    });
  });


  it("falls back to rpc for FunctionsFetchError responses", async () => {
    mocks.invokeMock.mockImplementation((functionName: string) => {
      if (functionName === "list-admins") {
        return Promise.resolve({ data: { admins: [] }, error: null });
      }

      if (functionName === "add-admin") {
        const error = new Error("Unexpected transport issue") as Error & { name?: string };
        error.name = "FunctionsFetchError";
        return Promise.resolve({ data: null, error });
      }

      return Promise.resolve({ data: null, error: null });
    });

    mocks.rpcMock.mockResolvedValue({
      data: "newadmin@example.com is now an admin.",
      error: null,
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newadmin@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.rpcMock).toHaveBeenCalledWith("promote_existing_user_to_admin", {
        target_email: "newadmin@example.com",
      });
    });
  });

  it("falls back to rpc for lowercase edge-function transport errors", async () => {
    mocks.invokeMock.mockImplementation((functionName: string) => {
      if (functionName === "list-admins") {
        return Promise.resolve({ data: { admins: [] }, error: null });
      }

      if (functionName === "add-admin") {
        return Promise.resolve({
          data: null,
          error: new Error("Failed to send a request to edge function"),
        });
      }

      return Promise.resolve({ data: null, error: null });
    });

    mocks.rpcMock.mockResolvedValue({
      data: "newadmin@example.com is now an admin.",
      error: null,
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newadmin@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.rpcMock).toHaveBeenCalledWith("promote_existing_user_to_admin", {
        target_email: "newadmin@example.com",
      });
    });
  });

  it("falls back to existing-user promotion when direct admin creation cannot reach Supabase", async () => {
    mocks.invokeMock.mockImplementation((functionName: string) => {
      if (functionName === "list-admins") {
        return Promise.resolve({ data: { admins: [] }, error: null });
      }

      if (functionName === "add-admin") {
        return Promise.resolve({
          data: null,
          error: new Error("Failed to fetch"),
        });
      }

      return Promise.resolve({ data: null, error: null });
    });

    mocks.rpcMock.mockResolvedValue({
      data: "newadmin@example.com is now an admin.",
      error: null,
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newadmin@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/set password \(optional\)/i), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Admin added",
          description:
            "Edge functions were unavailable, but newadmin@example.com already existed and is now an admin.",
        }),
      );
    });
  });

  it("shows clear guidance when edge functions are down and the target email has no account yet", async () => {
    mocks.invokeMock.mockImplementation((functionName: string) => {
      if (functionName === "list-admins") {
        return Promise.resolve({ data: { admins: [] }, error: null });
      }

      if (functionName === "add-admin") {
        return Promise.resolve({
          data: null,
          error: new Error("Failed to fetch"),
        });
      }

      return Promise.resolve({ data: null, error: null });
    });

    mocks.rpcMock.mockResolvedValue({
      data: null,
      error: new Error(
        "No account found for this email. Ask them to sign up first, then add them as admin.",
      ),
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newperson@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/set password \(optional\)/i), {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /add admin/i }));

    await waitFor(() => {
      expect(mocks.toastMock).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Failed to add admin",
          description:
            "Could not reach Supabase Edge Functions and no existing account was found for this email. Deploy the add-admin function to create brand-new admins, or ask this user to sign up first and then add them as admin.",
        }),
      );
    });
  });

  it("loads admins via rpc when list-admins edge function is unavailable", async () => {
    mocks.invokeMock.mockImplementation((functionName: string) => {
      if (functionName === "list-admins") {
        return Promise.resolve({
          data: null,
          error: new Error("Failed to send a request to edge function"),
        });
      }

      return Promise.resolve({ data: null, error: null });
    });

    mocks.rpcMock.mockImplementation((rpcName: string) => {
      if (rpcName === "list_admins_with_emails") {
        return Promise.resolve({
          data: [
            {
              id: "1",
              user_id: "u1",
              email: "admin@example.com",
              created_at: new Date().toISOString(),
            },
          ],
          error: null,
        });
      }

      return Promise.resolve({ data: null, error: null });
    });

    const { default: AdminManagement } = await import("./AdminManagement");

    render(
      <MemoryRouter>
        <AdminManagement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mocks.rpcMock).toHaveBeenCalledWith("list_admins_with_emails");
    });

    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  });
});
