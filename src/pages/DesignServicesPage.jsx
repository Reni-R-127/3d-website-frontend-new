import { Link } from "react-router-dom";

export default function DesignServicesPage() {
  return (
    <section className="design-services-page">
      <div className="design-services-page__content">
        <p>3D DESIGN SERVICES</p>

        <h1>Turn your idea into a 3D model.</h1>

        <p>
          Share your concept, sketch, or requirements with our team.
          We'll help you transform your idea into a 3D design.
        </p>

        <Link to="/custom-printing">
          Explore Custom Printing
        </Link>
      </div>
    </section>
  );
}
