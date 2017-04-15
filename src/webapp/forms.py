from flask_wtf import Form
from flask_wtf.html5 import EmailField, IntegerField
from wtforms import BooleanField, PasswordField, FloatField
from wtforms.fields import TextField
from wtforms.validators import NumberRange
from wtforms.validators import Required, Email


class TeamRegisterForm(Form):
    teamname = TextField("Teamname", validators=[Required()])
    email = EmailField("Email", validators=[Required(), Email()])
    phone = TextField("Telefonnummer", validators=[Required()])
    street = TextField("Adresse", validators=[Required()])
    streetnumber = TextField("Hausnummer", validators=[Required()])
    zipno = TextField("Postleitzahl", validators=[Required()])
    address_info = TextField("Adresszusatz", default="")
    lat = FloatField("Lat", validators=[Required()])
    lon = FloatField("Lon", validators=[Required()])
    member1 = TextField("Teammitglied 3", validators=[Required()])
    member2 = TextField("Teammitglied 3", validators=[Required()])
    member3 = TextField("Teammitglied 3", validators=[Required()])
    allergies = TextField("Allergien", default="")
    vegetarians = IntegerField("Vegetarier", validators={NumberRange(min=0, max=3)}, default=0)
    legal_accepted = BooleanField("Datenschutzbestimmungen", validators=[Required()])
    want_information = BooleanField("Informationen", default=False)


class AdminLoginForm(Form):
    login = TextField("Login")
    password = PasswordField("Passwort")


class TeamEditForm(Form):
    name = TextField("Teamname", validators=[Required()])
    email = EmailField("Email", validators=[Required(), Email()])
    phone = TextField("Telefonnummer", validators=[Required()])
    address = TextField("Adresse", validators=[Required()])
    zipno = TextField("Postleitzahl", validators=[Required()])
    address_info = TextField("Adresszusatz", default="")
    lat = FloatField("Lat", validators=[Required()])
    lon = FloatField("Lon", validators=[Required()])
    member1 = TextField("Teammitglied 3", validators=[Required()])
    member2 = TextField("Teammitglied 3", validators=[Required()])
    member3 = TextField("Teammitglied 3", validators=[Required()])
    allergies = TextField("Allergien", default="")
    vegetarians = IntegerField("Vegetarier", validators={NumberRange(min=0, max=3)}, default=0)
    backup = BooleanField("Warteliste")


class ConfirmForm(Form):
    confirmed = BooleanField(u"Bestaetigen")
