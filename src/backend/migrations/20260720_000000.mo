import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

/// First migration in the chain — introduces stable state for the Liza domain.
/// OldActor is `{}` because no prior version of this actor had any stable
/// fields. NewActor enumerates every stable field declared in main.mo and
/// supplies its initial value (pre-seeded catalogue + empty collections).
module {
  // Inlined old types — self-contained, no project imports.
  type OldActor = {};

  // Inlined AccessControlState — matches caffeineai-authorization shape.
  type UserRole = { #admin; #user; #guest };
  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  // Inlined new types — must match main.mo stable field names and types.
  type ServiceCategory = { #facial; #corporal; #especial };
  type ComboType = { #newClient; #monthly; #untilDecember };
  type ProductBadge = { #new; #recommended };

  type Service = {
    id : Nat;
    name : Text;
    description : Text;
    longDescription : Text;
    durationMins : Nat;
    priceCLP : Nat;
    category : ServiceCategory;
    techniques : [Text];
    toolsIncluded : [Text];
    allIncluded : Bool;
    cuposTotal : Nat;
    agendaproUrl : Text;
  };
  type Combo = {
    id : Nat;
    name : Text;
    description : Text;
    servicesIncluded : [Nat];
    priceCLP : Nat;
    regularPriceCLP : Nat;
    validity : Text;
    comboType : ComboType;
    cuposTotal : Nat;
    agendaproUrl : Text;
  };
  type Worker = {
    id : Nat;
    name : Text;
    role : Text;
    bio : Text;
    servicesIds : [Nat];
    silhouetteVariant : Nat;
  };
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    usage : Text;
    badge : ?ProductBadge;
  };
  type Testimonial = {
    id : Nat;
    clientName : Text;
    comment : Text;
  };
  type Partner = {
    id : Nat;
    name : Text;
    description : Text;
    logoText : Text;
  };
  type Application = {
    id : Nat;
    name : Text;
    email : Text;
    specialty : Text;
    message : Text;
    submittedAt : Nat;
  };

  type NewActor = {
    accessControlState : AccessControlState;
    services : List.List<Service>;
    combos : List.List<Combo>;
    workers : List.List<Worker>;
    products : List.List<Product>;
    testimonials : List.List<Testimonial>;
    partners : List.List<Partner>;
    applications : Map.Map<Nat, Application>;
    nextApplicationId : { var next : Nat };
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      services = seedServices();
      combos = seedCombos();
      workers = seedWorkers();
      products = seedProducts();
      testimonials = seedTestimonials();
      partners = seedPartners();
      applications = Map.empty();
      nextApplicationId = { var next = 0 };
    };
  };

  // --- Pre-seed helpers ---

  func seedServices() : List.List<Service> {
    let list = List.empty<Service>();
    list.add({
      id = 0;
      name = "Limpieza Facial Profunda";
      description = "Limpieza profunda con extracción y mascarilla.";
      longDescription = "Limpieza facial completa que incluye doble limpieza, vaporización, extracción de impurezas, mascarilla purificante e hidratación final. Ideal para todo tipo de piel.";
      durationMins = 60;
      priceCLP = 35000;
      category = #facial;
      techniques = [ "Doble limpieza", "Extracción manual", "Vaporización" ];
      toolsIncluded = [ "Mascarilla purificante", "Tónico", "Hidratante" ];
      allIncluded = true;
      cuposTotal = 12;
      agendaproUrl = "https://agendapro.com/cl/liza/limpieza-facial";
    });
    list.add({
      id = 1;
      name = "Radiofrecuencia Facial";
      description = "Tratamiento de firmeza con radiofrecuencia.";
      longDescription = "Sesión de radiofrecuencia facial que estimula la producción de colágeno, reafirma la piel y atenúa líneas de expresión. Incluye limpieza previa y crioterapia final.";
      durationMins = 75;
      priceCLP = 55000;
      category = #facial;
      techniques = [ "Radiofrecuencia monopolar", "Crioterapia", "Aplicación de suero" ];
      toolsIncluded = [ "Gel conductor", "Suero de colágeno" ];
      allIncluded = true;
      cuposTotal = 6;
      agendaproUrl = "https://agendapro.com/cl/liza/radiofrecuencia-facial";
    });
    list.add({
      id = 2;
      name = "Drenaje Linfático Manual";
      description = "Masaje corporal de drenaje linfático.";
      longDescription = "Técnica de masaje manual suave que estimula el sistema linfático, reduce retención de líquidos y favorece la desintoxicación corporal.";
      durationMins = 60;
      priceCLP = 40000;
      category = #corporal;
      techniques = [ "Drenaje linfático manual", "Movimientos lentos y rítmicos" ];
      toolsIncluded = [ "Aceite corporal ligero" ];
      allIncluded = false;
      cuposTotal = 12;
      agendaproUrl = "https://agendapro.com/cl/liza/drenaje-linfatico";
    });
    list.add({
      id = 3;
      name = "Masaje Reafirmante Corporal";
      description = "Masaje reafirmante con tecnología.";
      longDescription = "Tratamiento corporal que combina masaje reafirmante con aparatología para mejorar la firmeza y textura de la piel. Sesión de 90 minutos con productos profesionales.";
      durationMins = 90;
      priceCLP = 70000;
      category = #corporal;
      techniques = [ "Masaje reafirmante", "Aparatología", "Aplicación de crema tensora" ];
      toolsIncluded = [ "Crema tensora", "Gel conductor", "Mascarilla corporal" ];
      allIncluded = true;
      cuposTotal = 6;
      agendaproUrl = "https://agendapro.com/cl/liza/masaje-reafirmante";
    });
    list.add({
      id = 4;
      name = "Tratamiento Anti-Celulítico";
      description = "Protocolo intensivo anti-celulítico.";
      longDescription = "Protocolo intensivo que combina masaje modelador, aparatología y productos activos para reducir la apariencia de la celulitis. Recomendado en sesiones consecutivas.";
      durationMins = 90;
      priceCLP = 80000;
      category = #especial;
      techniques = [ "Masaje modelador", "Radiofrecuencia corporal", "Aplicación de activos" ];
      toolsIncluded = [ "Crema activa anti-celulítica", "Gel conductor", "Film oclusivo" ];
      allIncluded = true;
      cuposTotal = 4;
      agendaproUrl = "https://agendapro.com/cl/liza/anti-celulitico";
    });
    list.add({
      id = 5;
      name = "Hidratación Corporal Premium";
      description = "Hidratación corporal profunda con envoltura.";
      longDescription = "Tratamiento de hidratación corporal que incluye exfoliación, mascarilla hidratante y envoltura oclusiva para pieles resecas. Finaliza con masaje de absorción.";
      durationMins = 75;
      priceCLP = 50000;
      category = #corporal;
      techniques = [ "Exfoliación corporal", "Envoltura hidratante", "Masaje de absorción" ];
      toolsIncluded = [ "Exfoliante", "Mascarilla hidratante", "Crema de cierre" ];
      allIncluded = true;
      cuposTotal = 6;
      agendaproUrl = "https://agendapro.com/cl/liza/hidratacion-corporal";
    });
    list;
  };

  func seedCombos() : List.List<Combo> {
    let list = List.empty<Combo>();
    list.add({
      id = 0;
      name = "Bienvenida Liza";
      description = "Combo para nuevas clientas: limpieza facial + hidratación corporal.";
      servicesIncluded = [ 0, 5 ];
      priceCLP = 70000;
      regularPriceCLP = 85000;
      validity = "Primera visita";
      comboType = #newClient;
      cuposTotal = 6;
      agendaproUrl = "https://agendapro.com/cl/liza/combo-bienvenida";
    });
    list.add({
      id = 1;
      name = "Rutina Mensual Facial";
      description = "Limpieza facial + radiofrecuencia, una vez al mes.";
      servicesIncluded = [ 0, 1 ];
      priceCLP = 75000;
      regularPriceCLP = 90000;
      validity = "Mensual, renovable";
      comboType = #monthly;
      cuposTotal = 6;
      agendaproUrl = "https://agendapro.com/cl/liza/combo-mensual";
    });
    list.add({
      id = 2;
      name = "Verano hasta Diciembre";
      description = "Drenaje linfático + masaje reafirmante + hidratación corporal.";
      servicesIncluded = [ 2, 3, 5 ];
      priceCLP = 130000;
      regularPriceCLP = 160000;
      validity = "Válido hasta el 31 de diciembre";
      comboType = #untilDecember;
      cuposTotal = 4;
      agendaproUrl = "https://agendapro.com/cl/liza/combo-verano";
    });
    list;
  };

  func seedWorkers() : List.List<Worker> {
    let list = List.empty<Worker>();
    list.add({
      id = 0;
      name = "Gregoria Mendoza";
      role = "Especialista en cuidados faciales";
      bio = "Con más de 10 años de experiencia, Gregoria lidera los tratamientos faciales de Liza, especializándose en limpieza profunda, radiofrecuencia y protocolos anti-edad.";
      servicesIds = [ 0, 1 ];
      silhouetteVariant = 0;
    });
    list.add({
      id = 1;
      name = "Camila Rojas";
      role = "Terapeuta corporal";
      bio = "Camila es terapeuta corporal certificada en drenaje linfático y masajes reafirmantes. Su enfoque combina técnica y relajación.";
      servicesIds = [ 2, 3, 5 ];
      silhouetteVariant = 1;
    });
    list.add({
      id = 2;
      name = "Daniela Soto";
      role = "Especialista en tratamientos especiales";
      bio = "Daniela se especializa en protocolos anti-celulíticos y tratamientos intensivos con aparatología. Acompaña a cada clienta en su proceso.";
      servicesIds = [ 4 ];
      silhouetteVariant = 2;
    });
    list.add({
      id = 3;
      name = "Francisca Vera";
      role = "Esteticista integral";
      bio = "Francisca cubre tratamientos faciales y corporales, con foco en hidratación y bienestar general. Atiende también a clientas nuevas.";
      servicesIds = [ 0, 2, 5 ];
      silhouetteVariant = 3;
    });
    list;
  };

  func seedProducts() : List.List<Product> {
    let list = List.empty<Product>();
    list.add({
      id = 0;
      name = "Sérum Facial Hidratante Liza";
      description = "Sérum facial con ácido hialurónico para uso diario.";
      usage = "Aplicar sobre piel limpia mañana y noche, antes del hidratante.";
      badge = ?#new;
    });
    list.add({
      id = 1;
      name = "Crema Corporal Tensora";
      description = "Crema corporal reafirmante con activos tensoros.";
      usage = "Aplicar diariamente sobre la piel seca con masaje ascendente.";
      badge = ?#recommended;
    });
    list.add({
      id = 2;
      name = "Mascarilla Purificante";
      description = "Mascarilla facial purificante con arcilla blanca.";
      usage = "Usar 1-2 veces por semana sobre piel limpia, dejar 10 minutos y enjuagar.";
      badge = null;
    });
    list;
  };

  func seedTestimonials() : List.List<Testimonial> {
    let list = List.empty<Testimonial>();
    list.add({
      id = 0;
      clientName = "María José";
      comment = "La limpieza facial con Gregoria dejó mi piel renovada. Súper recomendable.";
    });
    list.add({
      id = 1;
      clientName = "Constanza";
      comment = "El combo mensual facial es lo mejor que he hecho por mi piel este año.";
    });
    list.add({
      id = 2;
      clientName = "Paulina";
      comment = "El drenaje linfático con Camila me ayudó muchísimo con la retención de líquidos.";
    });
    list;
  };

  func seedPartners() : List.List<Partner> {
    let list = List.empty<Partner>();
    list.add({
      id = 0;
      name = "Flow";
      description = "Pagos en cuotas simples y rápidas, con descuentos exclusivos para clientas del protocolo Liza.";
      logoText = "Flow";
    });
    list;
  };
};
