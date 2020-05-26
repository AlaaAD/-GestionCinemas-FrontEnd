import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CinemaService} from '../services/cinema.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  villes;
  cinemas;
  salles;
  projections;
  selectedTickets;
  currentVille;
  currentCinema;
  currentProjection;


  constructor(public cinemeService:CinemaService) { }

  ngOnInit() {
    this.cinemeService.getVillles().subscribe(data=>{
      this.villes=data;
    },error1 => {console.log(error1)})

  }



  onGetCinemas(v: any) {
    this.currentVille=v;
    this.salles=undefined;
    this.cinemeService.getCinemas(v).subscribe(data=>{
      this.cinemas=data;
    },error1 => {console.log(error1)})
  }
  onGetSalles(c: any) {
    this.currentCinema=c;
  //  console.log(c);
    this.cinemeService.getSalles(c).subscribe(data=>{
      this.salles=data;
      this.salles._embedded.salles.forEach(salle=>{
      //  console.log(salle)
        this.cinemeService.getProjections(salle).subscribe(data=>{
          salle.projections=data;
        //  console.log(salle.projections)
        },error1 => {console.log(error1)})
      })
    },error1 => {console.log(error1)})

  }

  onGetTicketsPlaces(p:any) {
  //  console.log(p);
    this.currentProjection=p;
   // console.log(this.currentProjection)
    this.cinemeService.getTicketsPlaces(p).subscribe(data =>{

      this.projections=data;
      this.selectedTickets=[];

    },error1 => console.log(error1))

   
  }

  onSelectTicket(t: any) {
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
    }
   else {
     this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
  // console.log(this.selectedTickets)
  }

  getTicketClass(t: any) {
    let str="margin btn ";
    if(t.reservee==true){
      str+="btn-danger";
    }
    else if (t.selected==true) {
      str+="btn-warning";
    }
    else {
      str+="btn-success";
    }
return str;
  }

  onPayTickets(dataForm,f) {

    let tickets=[];
this.selectedTickets.forEach(t=>{
  tickets.push(t.id);

})
    dataForm.tickets=tickets;
//console.log(dataForm)
    this.cinemeService.payerTickets(dataForm).subscribe(data=>{
      alert("Tickets résérvés avec succés");
      this.onGetTicketsPlaces(this.currentProjection);
      f.reset();
    })
  }
}
