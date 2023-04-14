import { createYoga } from "graphql-yoga";
import { g, InferResolvers, buildSchema } from "garph";

const money = g.type("Money", {
  amount: g.int(),
  formatted: g.string(),
});

const cartItem = g.type("CartItem", {
  id: g.id(),
  name: g.string(),
});

const cart = g.type("Cart", {
  id: g.id(),
  totalItems: g.int(),
  items: g.ref(cartItem).list(),
  subTotal: g.ref(money),
});

const query = g.type("Query", {
  cart: g.ref(cart).args({ id: g.id() }).description("Retrieve a Cart by ID"),
});

const resolvers: InferResolvers<{ Query: typeof query }, {}> = {
  Query: {
    cart: (_, args) => ({
      id: args.id,
      totalItems: 1,
      items: [{ id: "item-1", name: "Stickers" }],
      subTotal: {
        amount: 100,
        formatted: "£1",
      },
    }),
  },
};

const schema = buildSchema({ g, resolvers });

interface Env {}

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const yoga = createYoga({
      graphqlEndpoint: "/",
      landingPage: false,
      schema,
      maskedErrors: false,
    });

    return yoga.fetch(request, env, ctx);
  },
};
