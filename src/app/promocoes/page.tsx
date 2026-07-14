export const metadata = {
  title: "Promoções - Armarinho Premium",
  description: "Ofertas exclusivas de fios, linhas, tecidos e muito mais.",
}

export default function PromocoesPage() {
  return (
    <main className="flex-grow flex flex-col items-center w-full max-w-container-max mx-auto px-[var(--spacing-margin-desktop)] py-16 gap-16">
      {/* Hero Title Section */}
      <section className="w-full text-center space-y-4 mb-8">
        <h1 className="font-display-lg text-display-lg text-on-background">Ofertas Exclusivas</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Descubra seleções premium de materiais têxteis e ferramentas de artesanato com valores especiais. Uma oportunidade curada para elevar suas criações.
        </p>
      </section>
      
      {/* Featured Bento Grid */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-[var(--spacing-gutter)] h-auto md:h-[600px]">
        {/* Large Feature Card */}
        <article className="relative group overflow-hidden bg-surface-container-low rounded-lg col-span-1 md:col-span-2 md:row-span-2 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="absolute top-6 left-6 z-10 flex gap-2">
            <span className="bg-primary-container text-on-primary font-label-md text-label-md px-4 py-1 rounded-full uppercase tracking-wider">-40%</span>
            <span className="bg-surface-container-lowest text-on-background font-label-md text-label-md px-4 py-1 rounded-full border border-surface-dim">Destaque</span>
          </div>
          <div className="w-full h-2/3 relative overflow-hidden bg-surface-container">
            <img 
              alt="Conjunto Fios de Seda Orgânica" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-5hwaiV-oSnTU6dVbcC3aLrmLErTLcWmCtV1x7oleIG-4kdTWHywGsAt-XcIp3Tt0NNGO50-arApKSxJ4zrvN8vvwSezvR6vP2jQwS5403nGComawzSib7yxxn2ip-WTEZS8-wny9VGbrsFF2Aly24zQS5hGu4JAU8zqIWGAo7xzBWxBmwUJTUDCsprBuwf-rA-VJK21agDRb3UGq_QpLvA-M9DblaLAvP0bzMecoKGhY9Nmx_7JW"
            />
          </div>
          <div className="p-8 flex flex-col justify-between flex-grow bg-surface-container-lowest">
            <div>
              <p className="font-label-md text-label-md text-primary-container uppercase tracking-widest mb-2">Fios Nobres</p>
              <h2 className="font-headline-md text-headline-md text-on-background mb-4">Conjunto Fios de Seda Orgânica</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-md">Perfeito para bordados finos e alta costura. Brilho inigualável e resistência superior.</p>
            </div>
            <div className="flex items-end gap-4 mt-6">
              <span className="font-body-lg text-body-lg text-outline line-through">R$ 450,00</span>
              <span className="font-headline-sm text-headline-sm text-on-background">R$ 270,00</span>
            </div>
          </div>
        </article>
        
        {/* Small Feature Card 1 */}
        <article className="relative group overflow-hidden bg-surface-container-low rounded-lg hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-primary-container text-on-primary font-label-md text-label-md px-3 py-1 rounded-full uppercase tracking-wider">-25%</span>
          </div>
          <div className="w-full h-48 relative overflow-hidden bg-surface-container">
            <img 
              alt="Tesoura de Alfaiate Titânio" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTbInhwnx_dvDRvcjOat_6037oKY4ahbT4cYpSTKQGAJ7Ed-H9MGUeQRrl-fryQpRwiFqLy3OGQrvQ6xyJabxRndKUIJPj7iKC99UPfjtV1oHVd99tPdRxEmbcgrvk5ZMRhOAbRhyUubEUSO9RDYiCkKSEUISX80OTv2ZfEXHCEzBM4pOt3Wkl7Xy6d4DJeQcJAhk8DQjrF1WymPfTaYG7YgEAmYgTGMoNf50PwszyifdnAxyaxeOM"
            />
          </div>
          <div className="p-6 flex flex-col flex-grow bg-surface-container-lowest">
            <p className="font-label-md text-label-md text-primary-container uppercase tracking-widest mb-1">Ferramentas</p>
            <h3 className="font-body-lg text-body-lg font-semibold text-on-background mb-auto">Tesoura de Alfaiate Titânio</h3>
            <div className="flex items-end gap-3 mt-4">
              <span className="font-body-md text-body-md text-outline line-through">R$ 180,00</span>
              <span className="font-headline-sm text-headline-sm text-on-background">R$ 135,00</span>
            </div>
          </div>
        </article>
        
        {/* Small Feature Card 2 */}
        <article className="relative group overflow-hidden bg-surface-container-low rounded-lg hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col">
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-primary-container text-on-primary font-label-md text-label-md px-3 py-1 rounded-full uppercase tracking-wider">-30%</span>
          </div>
          <div className="w-full h-48 relative overflow-hidden bg-surface-container">
            <img 
              alt="Renda Francesa Chantilly" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgnt9tJ4emnDICIXSNR-Xqoab84gGSMchVbSURz8klry92aSFc9iU8yq5ww_DNhE9OSqB4j_wag2wDfI_SDW1ZM8UTrqvpBT_kSzAZU7Aa2igrxm0lucRjNrv6gXwqxbxOVhg37RHssn4qsGMCfwgAIeWjkRii9m_EptTi3h0gNNRAsITv2-loszpmbwXnZxVYO0M8liDq7o1pIL--bSHlha5bVh4V0NgcmElxJ092DaCaqDZl-7XF"
            />
          </div>
          <div className="p-6 flex flex-col flex-grow bg-surface-container-lowest">
            <p className="font-label-md text-label-md text-primary-container uppercase tracking-widest mb-1">Aviamentos</p>
            <h3 className="font-body-lg text-body-lg font-semibold text-on-background mb-auto">Renda Francesa Chantilly</h3>
            <div className="flex items-end gap-3 mt-4">
              <span className="font-body-md text-body-md text-outline line-through">R$ 90,00/m</span>
              <span className="font-headline-sm text-headline-sm text-on-background">R$ 63,00/m</span>
            </div>
          </div>
        </article>
      </section>

      {/* Divider */}
      <div className="w-full h-px bg-surface-container-highest my-8"></div>

      {/* Catalog Grid */}
      <section className="w-full">
        <div className="flex justify-between items-end mb-8">
          <h2 className="font-headline-md text-headline-md text-on-background">Mais Oportunidades</h2>
          <div className="hidden md:flex gap-2">
            <button className="px-4 py-2 rounded-full bg-surface-container-low text-on-background font-label-md text-label-md hover:bg-surface-container-high transition-colors">Todos</button>
            <button className="px-4 py-2 rounded-full bg-surface-container-lowest border border-surface-dim text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors">Fios</button>
            <button className="px-4 py-2 rounded-full bg-surface-container-lowest border border-surface-dim text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors">Agulhas</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-[var(--spacing-gutter)] gap-y-12">
          {/* Catalog Card 1 */}
          <article className="group cursor-pointer flex flex-col gap-4 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 p-4 -m-4 rounded-lg">
            <div className="w-full aspect-[4/5] relative overflow-hidden bg-surface-container rounded-lg">
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-primary-container text-on-primary font-caption text-caption px-2 py-1 rounded-sm uppercase tracking-widest">-15%</span>
              </div>
              <img alt="Novelo Lã Merino Pura 100g" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4aRURedvPk9t2198JvfBY_-fFI8t24seaqA5pJBRveeW8axYjwxqUxj1HJVXw3srXZvmKHrdzFqEchF0bi1S34N-8om4QsCi83sJIal7j2eaTj95bc9i3VrlK8XrpyqoHWA20iRmErmIUQPbwkThG0hPUC_wrH3LPLGI4ckIVazZTsGhuGwcPAyfEig0psyyJygZv-wlAVWznGVZnnOETscCLFT6UK0Jr-tY8UJvHfRuujnwMPFuR"/>
            </div>
            <div>
              <p className="font-label-md text-label-md text-primary-container uppercase tracking-widest mb-1">Lãs Premium</p>
              <h4 className="font-body-md text-body-md text-on-background leading-tight">Novelo Lã Merino Pura 100g</h4>
            </div>
            <div className="flex flex-col mt-auto">
              <span className="font-caption text-caption text-outline line-through">R$ 120,00</span>
              <span className="font-body-lg text-body-lg font-semibold text-on-background">R$ 102,00</span>
            </div>
          </article>
          
          {/* Catalog Card 2 */}
          <article className="group cursor-pointer flex flex-col gap-4 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 p-4 -m-4 rounded-lg">
            <div className="w-full aspect-[4/5] relative overflow-hidden bg-surface-container rounded-lg">
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-primary-container text-on-primary font-caption text-caption px-2 py-1 rounded-sm uppercase tracking-widest">-20%</span>
              </div>
              <img alt="Kit Agulhas Crochê Bambu" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3cdqfXb4UpCvfAW_zp7av71NVI1VwSDTUIzMJYIlGwW80GTVd-luEzY1sKbY8xnoGnObMVUlF1_7sOIwv3eyC6z7aG8TV5mF81t5Hs-kv0kJxiA4gDeZzOwWVbZ89oO6WoExxv4ka8LesfXQU6-NIz_hNCrXR-5HgHldDyG6n_nFvx-ev4PQHnbsX9QNFB-g9xXjAo2d39wL4MQtOj2MQr6x_MLVAZNuTgbVJxInWu2H0D_E9y0G"/>
            </div>
            <div>
              <p className="font-label-md text-label-md text-primary-container uppercase tracking-widest mb-1">Ferramentas</p>
              <h4 className="font-body-md text-body-md text-on-background leading-tight">Kit Agulhas Crochê Bambu</h4>
            </div>
            <div className="flex flex-col mt-auto">
              <span className="font-caption text-caption text-outline line-through">R$ 85,00</span>
              <span className="font-body-lg text-body-lg font-semibold text-on-background">R$ 68,00</span>
            </div>
          </article>
          
          {/* Catalog Card 3 */}
          <article className="group cursor-pointer flex flex-col gap-4 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 p-4 -m-4 rounded-lg">
            <div className="w-full aspect-[4/5] relative overflow-hidden bg-surface-container rounded-lg">
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-primary-container text-on-primary font-caption text-caption px-2 py-1 rounded-sm uppercase tracking-widest">-50%</span>
              </div>
              <img alt="Lote Botões Vintage Madrepérola" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCa-jK8g1Uz7zddlxeEic-VoxNJkv3-DU0NH65qhEqajzEPZARKH6vYBTjqvOWN6ehOK71paheoDRH2fhtJ36ZjaQXqf3NJrH0i2PPw9OE-0GS7VmkQFIkIuAP6QApc2bHn1cYGRYtyNMpjtU6pmQPYQz8gyOISGRAnINsRrf3uGzTE9TUIMGynpCEiIGY-51xGjTqg_DrP5Jj5e83ZgUIFgEFWEmuxbs0xVapSNNQqIcz1OrKTwEQh"/>
            </div>
            <div>
              <p className="font-label-md text-label-md text-primary-container uppercase tracking-widest mb-1">Botões</p>
              <h4 className="font-body-md text-body-md text-on-background leading-tight">Lote Botões Vintage Madrepérola</h4>
            </div>
            <div className="flex flex-col mt-auto">
              <span className="font-caption text-caption text-outline line-through">R$ 200,00</span>
              <span className="font-body-lg text-body-lg font-semibold text-on-background">R$ 100,00</span>
            </div>
          </article>
          
          {/* Catalog Card 4 */}
          <article className="group cursor-pointer flex flex-col gap-4 hover:shadow-[0px_10px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 p-4 -m-4 rounded-lg">
            <div className="w-full aspect-[4/5] relative overflow-hidden bg-surface-container rounded-lg">
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-primary-container text-on-primary font-caption text-caption px-2 py-1 rounded-sm uppercase tracking-widest">-10%</span>
              </div>
              <img alt="Bastidor Madeira Nobre Ajustável" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKshGBsDzEajdhU8z1Xyy3Qkus9wLgme80djSpgg9Uwg1gUmsbWDb7IDanf56E9IAzgZ03m16x29KdhjJ_ntdBVw1NULgGU3aiNJ5zZif_omA0LbsyIGJOkqN-J7Blw6nlT8U9t4Tzutqgoh0gzm-qMX_PON4bPPY5-e4e2GyuSd06r1i-tsRH8G4iVSy81DkjTyqOeq7-Ss4zIGwLYR7N5t27decZYFv7YnuPf2UfmnwNJW4iVxJQ"/>
            </div>
            <div>
              <p className="font-label-md text-label-md text-primary-container uppercase tracking-widest mb-1">Bordado</p>
              <h4 className="font-body-md text-body-md text-on-background leading-tight">Bastidor Madeira Nobre Ajustável</h4>
            </div>
            <div className="flex flex-col mt-auto">
              <span className="font-caption text-caption text-outline line-through">R$ 60,00</span>
              <span className="font-body-lg text-body-lg font-semibold text-on-background">R$ 54,00</span>
            </div>
          </article>
        </div>
        
        <div className="w-full flex justify-center mt-16">
          <button className="border border-on-background text-on-background hover:bg-surface-container px-8 py-3 rounded font-label-md text-label-md uppercase tracking-wider transition-colors">
            Carregar Mais Ofertas
          </button>
        </div>
      </section>
    </main>
  )
}
