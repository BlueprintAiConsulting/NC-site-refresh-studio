import { ShoppingBag, Shirt, Coffee } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "./animations/FadeIn";

const merchItems = [
  {
    icon: Shirt,
    title: "Apparel",
    description: "T-shirts, hoodies, and hats featuring our church logo.",
  },
  {
    icon: Coffee,
    title: "Drinkware",
    description: "Mugs and tumblers for your daily coffee or tea.",
  },
  {
    icon: ShoppingBag,
    title: "Accessories",
    description: "Bags, stickers, and other items to show your church pride.",
  },
];

export function Merch() {
  return (
    <section id="merch" className="section-church border-t border-border">
      <div className="container max-w-5xl mx-auto px-5">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Merch</h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl">
            Show your New Creation pride with our church merchandise.
          </p>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-3 gap-6 mb-8">
          {merchItems.map((item) => (
            <StaggerItem key={item.title}>
              <div className="card-church h-full text-center">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.3}>
          <div className="card-church max-w-xl mx-auto text-center bg-secondary/50">
            <p className="text-muted-foreground text-sm mb-4">
              Merchandise is available for purchase at the church office during regular hours 
              or after Sunday services at our Welcome Center.
            </p>
            <a href="#contact" className="btn-primary">
              Inquire About Merch
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
