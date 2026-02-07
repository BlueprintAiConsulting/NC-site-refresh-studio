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
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
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
});
