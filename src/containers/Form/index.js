import { useCallback, useState, useRef } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 100); })

// Fonction de validation d'email
const isValidEmail = email => {
  const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(String(email).toLowerCase());
};

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const formRef = useRef(null);

  const areFieldsValid = () => {
    const form = formRef.current;
    if (!form) return false;

    const name = form.name.value;
    const firstName = form.firstName.value;
    const email = form.email.value;
    const message = form.message.value

    // Vérifiez les champs vides et l'email valide
    return name && firstName && message && isValidEmail(email);
  };

  const sendContact = useCallback(
    async (evt) => {
      evt.preventDefault();

      if (!areFieldsValid()) {
        onError(new Error("Invalid input values."));
        alert('Veuillez remplir tous les champs correctement.'); // <-- Ajoutez cette ligne
        return;
      }

      setSending(true);

      try {
        await mockContactApi();
        setSending(false);
        formRef.current.reset();
        onSuccess();
      } catch (err) {
        setSending(false);
        onError(err);
      }
    },
    [onSuccess, onError]
  );


  return (
    <form ref={formRef} onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field name="name" placeholder="" label="Nom" />
          <Field name="firstName" placeholder="" label="Prénom" />
          <Select
            selection={["Personel", "Entreprise"]}
            onChange={() => null}
            label="Personel / Entreprise"
            type="large"
            titleEmpty
          />
          <Field name="email" placeholder="" label="Email" />
          <Button type={BUTTON_TYPES.SUBMIT} disabled={sending} data-testid="button-test-id">
            {sending ? "En cours" : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            name="message"
            placeholder="message"
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
}

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
}

export default Form;
